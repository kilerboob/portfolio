"""add portfolio tables

Revision ID: c38f9715290b
Revises: d9118cdb713d
Create Date: 2025-08-31 19:37:02.002942

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'c38f9715290b'
down_revision: Union[str, Sequence[str], None] = 'd9118cdb713d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # UUID extension
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    # Enums: create once, then reference existing types in columns (avoid duplicate CREATE TYPE)
    project_status = postgresql.ENUM('draft', 'in_progress', 'done', 'archived', name='project_status')
    media_kind = postgresql.ENUM('image', 'video', name='media_kind')
    project_status.create(op.get_bind(), checkfirst=True)
    media_kind.create(op.get_bind(), checkfirst=True)

    # Use existing named enums for column definitions without recreating types
    project_status_ref = postgresql.ENUM(name='project_status', create_type=False)
    media_kind_ref = postgresql.ENUM(name='media_kind', create_type=False)

    # profile
    op.create_table(
        'profile',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('display_name', sa.String(120), nullable=False),
        sa.Column('headline', sa.String(160)),
        sa.Column('bio', sa.Text()),
        sa.Column('email_public', sa.String(160)),
        sa.Column('telegram', sa.String(120)),
        sa.Column('github', sa.String(160)),
        sa.Column('website', sa.String(160)),
        sa.Column('location', sa.String(120)),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # skill
    op.create_table(
        'skill',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('name', sa.String(80), nullable=False, unique=True),
        sa.Column('category', sa.String(80)),
        sa.Column('weight', sa.Integer(), nullable=False, server_default='50'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # tag
    op.create_table(
        'tag',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('name', sa.String(50), nullable=False, unique=True),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # client
    op.create_table(
        'client',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('name', sa.String(160), nullable=False),
        sa.Column('website', sa.String(200)),
        sa.Column('logo_url', sa.String(200)),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # project
    op.create_table(
        'project',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('title', sa.String(160), nullable=False),
        sa.Column('slug', sa.String(160), nullable=False, unique=True),
        sa.Column('short_desc', sa.String(240)),
        sa.Column('description', sa.Text()),
        sa.Column('repo_url', sa.String(200)),
        sa.Column('demo_url', sa.String(200)),
        sa.Column('client_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('client.id', ondelete="SET NULL")),
    sa.Column('status', project_status_ref, nullable=False, server_default='done'),
        sa.Column('started_at', sa.Date()),
        sa.Column('finished_at', sa.Date()),
        sa.Column('featured', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    # indexes for project
    op.create_index('ix_project_status', 'project', ['status'])
    op.create_index('ix_project_featured', 'project', ['featured'], postgresql_where=sa.text('featured = true'))

    # media_asset
    op.create_table(
        'media_asset',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('project.id', ondelete="CASCADE"), nullable=False),
    sa.Column('kind', media_kind_ref, nullable=False),
        sa.Column('url', sa.String(300), nullable=False),
        sa.Column('alt', sa.String(200)),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
    )
    op.create_index('ix_media_asset_project_order', 'media_asset', ['project_id', 'sort_order'])

    # service
    op.create_table(
        'service',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('title', sa.String(160), nullable=False),
        sa.Column('slug', sa.String(160), nullable=False, unique=True),
        sa.Column('summary', sa.String(240)),
        sa.Column('description', sa.Text()),
        sa.Column('base_price', sa.Numeric(12, 2)),
        sa.Column('currency', sa.String(8), server_default='USD'),
        sa.Column('delivery_days', sa.Integer()),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # testimonial
    op.create_table(
        'testimonial',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('client_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('client.id', ondelete="SET NULL")),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('project.id', ondelete="SET NULL")),
        sa.Column('author_name', sa.String(120), nullable=False),
        sa.Column('author_role', sa.String(120)),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('rating', sa.Integer()),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # contact_message
    op.create_table(
        'contact_message',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('name', sa.String(120)),
        sa.Column('email', sa.String(160)),
        sa.Column('subject', sa.String(200)),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('source', sa.String(40), server_default='site'),
        sa.Column('utm', postgresql.JSONB(astext_type=sa.Text())),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_contact_message_created', 'contact_message', ['created_at'])

    # m2m: project_skill
    op.create_table(
        'project_skill',
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('project.id', ondelete="CASCADE"), primary_key=True),
        sa.Column('skill_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('skill.id', ondelete="CASCADE"), primary_key=True),
        sa.Column('level', sa.Integer(), nullable=False, server_default='70'),
    )

    # m2m: project_tag
    op.create_table(
        'project_tag',
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('project.id', ondelete="CASCADE"), primary_key=True),
        sa.Column('tag_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('tag.id', ondelete="CASCADE"), primary_key=True),
    )

    # m2m: service_tag
    op.create_table(
        'service_tag',
        sa.Column('service_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('service.id', ondelete="CASCADE"), primary_key=True),
        sa.Column('tag_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('tag.id', ondelete="CASCADE"), primary_key=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('service_tag')
    op.drop_table('project_tag')
    op.drop_table('project_skill')
    op.drop_index('ix_contact_message_created', table_name='contact_message')
    op.drop_table('contact_message')
    op.drop_table('testimonial')
    op.drop_table('service')
    op.drop_index('ix_media_asset_project_order', table_name='media_asset')
    op.drop_table('media_asset')
    op.drop_index('ix_project_featured', table_name='project')
    op.drop_index('ix_project_status', table_name='project')
    op.drop_table('project')
    op.drop_table('client')
    op.drop_table('tag')
    op.drop_table('skill')
    op.drop_table('profile')

    # Enums
    postgresql.ENUM(name='media_kind').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM(name='project_status').drop(op.get_bind(), checkfirst=True)
