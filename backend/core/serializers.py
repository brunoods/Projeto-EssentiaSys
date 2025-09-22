from rest_framework import serializers
from .models import (
    MateriaPrima, ProdutoAcabado, ReceitaItem, Fornecedor, Cliente, Compra,
    Venda, Despesa
)

class MateriaPrimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MateriaPrima
        fields = ['id', 'nome', 'unidade_medida', 'estoque_atual', 'custo_por_unidade', 'estoque_minimo']
        read_only_fields = ('id', 'estoque_atual', 'custo_por_unidade')

class ReceitaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceitaItem
        fields = ['id', 'materia_prima', 'quantidade']

class ProdutoAcabadoSerializer(serializers.ModelSerializer):
    itens_receita = ReceitaItemSerializer(many=True)

    class Meta:
        model = ProdutoAcabado
        fields = [
            'id', 'nome', 'categoria', 'preco_venda', 'estoque_atual',
            'estoque_minimo', 'custo_embalagem', 'custo_outros', 'itens_receita'
        ]
        read_only_fields = ('id', 'estoque_atual')
    
    def create(self, validated_data):
        itens_receita_data = validated_data.pop('itens_receita')
        produto = ProdutoAcabado.objects.create(**validated_data)
        for item_data in itens_receita_data:
            ReceitaItem.objects.create(produto_acabado=produto, **item_data)
        return produto

class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = ['id', 'nome', 'contacto', 'email', 'cnpj', 'endereco', 'notas']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nome', 'contacto', 'email', 'cpf', 'endereco', 'notas']

class CompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compra
        fields = ['id', 'materia_prima', 'fornecedor', 'data_compra', 'quantidade', 'custo_total']

class VendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venda
        fields = [
            'id', 'produto', 'cliente', 'data_venda', 'quantidade', 'desconto',
            'forma_pagamento', 'status_pagamento'
        ]
        read_only_fields = ('id', 'data_venda')

class DespesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Despesa
        fields = ['id', 'data', 'descricao', 'categoria', 'valor']