# Migration Best Practices

**Rule**: Safe migrations that don't lock tables

## Safe Migrations

```python
# ✅ SAFE - Adding nullable field
class Migration(migrations.Migration):
    operations = [
        migrations.AddField(
            model_name='asset',
            name='new_field',
            field=models.CharField(max_length=100, null=True, blank=True),
        ),
    ]

# ❌ UNSAFE - Adding NOT NULL without default (locks table)
migrations.AddField(
    model_name='asset',
    name='new_field',
    field=models.CharField(max_length=100),  # Locks!
)
```

## Safe Pattern for NOT NULL

```python
# Step 1: Add nullable
migrations.AddField(
    model_name='asset',
    name='new_field',
    field=models.CharField(max_length=100, null=True),
)

# Step 2: Populate data
def populate_field(apps, schema_editor):
    Asset = apps.get_model('assets', 'Asset')
    Asset.objects.update(new_field='default')

migrations.RunPython(populate_field)

# Step 3: Make NOT NULL
migrations.AlterField(
    model_name='asset',
    name='new_field',
    field=models.CharField(max_length=100, null=False),
)
```

## Index Concurrently

```python
# ✅ SAFE - Non-blocking index creation
class Migration(migrations.Migration):
    atomic = False  # Required for CONCURRENTLY

    operations = [
        migrations.AddIndex(
            model_name='asset',
            index=models.Index(
                fields=['status'],
                name='asset_status_idx',
            ),
        ),
    ]
```

**Rule**: Never lock production tables
