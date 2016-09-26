from Hub.models import Members, Element, Favorite
from rest_framework import serializers


class FavoriteListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        data = data.filter(owner=self.context['request'].user)
        return super(FavoriteListSerializer, self).to_representation(data)


class FavoriteSerializer(serializers.ModelSerializer):

    class Meta:
        list_serializer_class = FavoriteListSerializer
        model = Favorite
        fields = ('element', 'owner', 'created_at', 'updated_at',)


class MembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Members
        fields = ('element', 'user_involved', 'created_at', 'updated_at',)


class ElementSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='owner.username', required=False)
    first_name = serializers.ReadOnlyField(source='owner.first_name', required=False)
    last_name = serializers.ReadOnlyField(source='owner.last_name', required=False)
    members = MembersSerializer(many=True, read_only=True)
    favorite = FavoriteSerializer(many=True, read_only=True, required=False)

    class Meta:
        model = Element
        fields = ('id', 'parent','name', 'description', 'is_delete', 'element_type', 'created_at', 'updated_at',
                  'members', 'owner', 'username', 'first_name', 'last_name'
                  , 'favorite'
                  )

    def create(self, validated_data):
        hub = super(ElementSerializer, self).create(validated_data)
        hub.owner = self.context['request'].user
        hub.save()

        hub_members = Members()
        hub_members.user_involved = hub.owner
        hub_members.element = hub
        hub_members.save()

        return hub
