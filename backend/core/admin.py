from django.contrib import admin
from .models import (
    MateriaPrima, ProdutoAcabado, ReceitaItem, Fornecedor, Cliente, Compra,
    Venda, Despesa
)

# Regista todos os modelos para que apareçam no painel de administração.
admin.site.register(MateriaPrima)
admin.site.register(ProdutoAcabado)
admin.site.register(ReceitaItem)
admin.site.register(Fornecedor)
admin.site.register(Cliente)
admin.site.register(Compra)
admin.site.register(Venda)
admin.site.register(Despesa)