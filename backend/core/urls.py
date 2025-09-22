from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MateriaPrimaViewSet, ProdutoAcabadoViewSet, FornecedorViewSet,
    ClienteViewSet, CompraViewSet, VendaViewSet, DespesaViewSet
)

# Cria um router
router = DefaultRouter()

# Regista os nossos ViewSets no router
router.register(r'materias-primas', MateriaPrimaViewSet, basename='materiaprima')
router.register(r'produtos', ProdutoAcabadoViewSet, basename='produtoacabado')
router.register(r'fornecedores', FornecedorViewSet, basename='fornecedor')
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'compras', CompraViewSet, basename='compra')
router.register(r'vendas', VendaViewSet, basename='venda')
router.register(r'despesas', DespesaViewSet, basename='despesa')

# Os URLs da API são agora gerados automaticamente pelo router
urlpatterns = [
    path('', include(router.urls)),
]