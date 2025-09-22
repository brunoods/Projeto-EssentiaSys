from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import (
    MateriaPrima, ProdutoAcabado, Fornecedor, Cliente, Compra, Venda, Despesa
)
from .serializers import (
    MateriaPrimaSerializer, ProdutoAcabadoSerializer, FornecedorSerializer,
    ClienteSerializer, CompraSerializer, VendaSerializer, DespesaSerializer
)

class BaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet base que filtra os objetos para pertencerem apenas ao usuário logado
    e associa o usuário ao criar um novo objeto.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra todos os objetos para o usuário logado
        return self.queryset.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Associa o usuário logado automaticamente ao criar um objeto
        serializer.save(usuario=self.request.user)

class MateriaPrimaViewSet(BaseViewSet):
    queryset = MateriaPrima.objects.all()
    serializer_class = MateriaPrimaSerializer

class ProdutoAcabadoViewSet(BaseViewSet):
    queryset = ProdutoAcabado.objects.all()
    serializer_class = ProdutoAcabadoSerializer

class FornecedorViewSet(BaseViewSet):
    queryset = Fornecedor.objects.all()
    serializer_class = FornecedorSerializer

class ClienteViewSet(BaseViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class CompraViewSet(viewsets.ModelViewSet): # Compra não tem o campo 'usuario' diretamente
    permission_classes = [IsAuthenticated]
    serializer_class = CompraSerializer
    
    def get_queryset(self):
        return Compra.objects.filter(materia_prima__usuario=self.request.user)
    
    @transaction.atomic
    def perform_create(self, serializer):
        nova_compra = serializer.save()
        mp = nova_compra.materia_prima
        novo_estoque = mp.estoque_atual + nova_compra.quantidade
        novo_custo_total = (mp.estoque_atual * mp.custo_por_unidade) + nova_compra.custo_total
        mp.estoque_atual = novo_estoque
        if novo_estoque > 0:
            mp.custo_por_unidade = novo_custo_total / novo_estoque
        else:
            mp.custo_por_unidade = 0
        mp.save()

class VendaViewSet(viewsets.ModelViewSet): # Venda não tem o campo 'usuario' diretamente
    permission_classes = [IsAuthenticated]
    serializer_class = VendaSerializer
    
    def get_queryset(self):
        return Venda.objects.filter(produto__usuario=self.request.user)

    @transaction.atomic
    def perform_create(self, serializer):
        venda = serializer.save()
        produto = venda.produto
        if produto.estoque_atual < venda.quantidade:
            raise serializers.ValidationError(f"Estoque insuficiente para {produto.nome}.")
        
        venda.preco_venda_unitario = produto.preco_venda
        venda.custo_producao_unitario = produto.calcular_custo_producao()
        venda.save()

        produto.estoque_atual -= venda.quantidade
        produto.save()

class DespesaViewSet(BaseViewSet):
    queryset = Despesa.objects.all()
    serializer_class = DespesaSerializer