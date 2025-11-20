# Complete Contract Validation Workflow

End-to-end example: Asset CRUD endpoints

## Step 1: Contract Definition

```yaml
# binora-contract/openapi.yaml
/api/assets/:
  get:
    summary: List assets
    security:
      - bearerAuth: []
    parameters:
      - name: status
        in: query
        schema:
          type: string
    responses:
      200:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/AssetOutput'
  post:
    summary: Create asset
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/AssetInput'
    responses:
      201:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AssetOutput'
      400:
        description: Validation error

components:
  schemas:
    AssetInput:
      type: object
      required:
        - code
        - status
      properties:
        code:
          type: string
        status:
          type: string
        description:
          type: string
    
    AssetOutput:
      type: object
      properties:
        id:
          type: integer
        code:
          type: string
        status:
          type: string
        description:
          type: string
        created_at:
          type: string
          format: date-time
```

## Step 2: Serializers

```python
# apps/assets/serializers.py
class AssetInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ['code', 'status', 'description']  # ✅ Matches AssetInput
        extra_kwargs = {
            'code': {'required': True},  # ✅ Required in contract
            'status': {'required': True},  # ✅ Required in contract
            'description': {'required': False},  # ✅ Optional in contract
        }

class AssetOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ['id', 'code', 'status', 'description', 'created_at']  # ✅ Matches AssetOutput
        read_only_fields = ['id', 'created_at']  # ✅ Read-only in contract
```

## Step 3: ViewSet

```python
# apps/assets/views.py
from rest_framework.permissions import IsAuthenticated

class AssetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # ✅ Contract requires bearerAuth
    filterset_fields = ['status']  # ✅ Contract has status query param
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AssetInputSerializer  # ✅ Input for write
        return AssetOutputSerializer  # ✅ Output for read
    
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)  # ✅ 200 per contract
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # ✅ Returns 400 on validation error
        asset = self.perform_create(serializer)
        output = AssetOutputSerializer(asset)
        return Response(output.data, status=status.HTTP_201_CREATED)  # ✅ 201 per contract
```

## Step 4: Validation Script

```bash
# /check-contract assets
# Validates:
# - Endpoints exist
# - Status codes match
# - Schemas match
# - Authentication enforced
# - Parameters accepted
```

## Step 5: Test Contract Compliance

```python
# apps/assets/tests/asset_views_tests.py
@pytest.mark.django_db
def test_list_assets_returns_200_with_correct_schema(api_client, asset_factory, user_factory):
    user = user_factory()
    api_client.force_authenticate(user=user)
    asset = asset_factory()
    
    response = api_client.get('/api/assets/')
    
    # Status code matches contract
    assert response.status_code == 200  # ✅ Contract says 200
    
    # Schema matches AssetOutput
    assert 'id' in response.data[0]
    assert 'code' in response.data[0]
    assert 'status' in response.data[0]
    assert 'created_at' in response.data[0]

@pytest.mark.django_db
def test_create_asset_returns_201_with_valid_data(api_client, user_factory):
    user = user_factory()
    api_client.force_authenticate(user=user)
    data = {'code': 'A001', 'status': 'active'}  # ✅ Matches AssetInput
    
    response = api_client.post('/api/assets/', data)
    
    assert response.status_code == 201  # ✅ Contract says 201
    assert 'id' in response.data  # ✅ AssetOutput includes id
    assert response.data['code'] == 'A001'

@pytest.mark.django_db
def test_create_asset_returns_400_with_invalid_data(api_client, user_factory):
    user = user_factory()
    api_client.force_authenticate(user=user)
    data = {}  # Missing required fields
    
    response = api_client.post('/api/assets/', data)
    
    assert response.status_code == 400  # ✅ Contract says 400 for validation error

@pytest.mark.django_db
def test_list_assets_returns_401_without_auth(api_client):
    response = api_client.get('/api/assets/')
    
    assert response.status_code == 401  # ✅ Contract requires bearerAuth
```

## Validation Checklist

- [x] Contract defines endpoints and schemas
- [x] Serializers match schemas exactly
- [x] ViewSet uses correct serializers
- [x] Status codes match contract
- [x] Authentication enforced per contract
- [x] Parameters accepted as specified
- [x] Tests validate contract compliance

**Reference**: apps/assets/views.py, apps/assets/serializers.py
