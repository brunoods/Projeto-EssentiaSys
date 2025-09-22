# novo_models.py

from django.db import models
from django.conf import settings
from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from django.utils import timezone

class MateriaPrima(models.Model):
    # A nova linha de código que liga a matéria-prima a um utilizador
    # O on_delete=models.CASCADE garante que a matéria-prima é apagada se o utilizador for apagado.
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    nome = models.CharField(max_length=200)
    unidade_medida = models.CharField(max_length=50)
    # A lógica de stock e custo será gerenciada pelo backend, como no seu gerenciador.py
    estoque_atual = models.DecimalField(max_digits=10, decimal_places=3, default=0.0)
    custo_por_unidade = models.DecimalField(max_digits=10, decimal_places=4, default=0.0)
    estoque_minimo = models.DecimalField(max_digits=10, decimal_places=3, default=0.0)

    class Meta:
        # Garante que um utilizador não pode ter duas matérias-primas com o mesmo nome
        unique_together = ('usuario', 'nome')

    def __str__(self):
        return f"{self.nome} ({self.usuario.username})"


class ProdutoAcabado(models.Model):
    # Ligação ao utilizador, seguindo a mesma lógica
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    nome = models.CharField(max_length=200)
    categoria = models.CharField(max_length=100, default="Sem Categoria", blank=True)
    preco_venda = models.DecimalField(max_digits=10, decimal_places=2)
    estoque_atual = models.PositiveIntegerField(default=0)
    estoque_minimo = models.PositiveIntegerField(default=0)
    custo_embalagem = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    custo_outros = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    class Meta:
        unique_together = ('usuario', 'nome')

    def __str__(self):
        return f"{self.nome} ({self.usuario.username})"

    def calcular_custo_producao(self):
        # ... A lógica de cálculo do custo pode ser mantida
        custo_materias_primas = self.itens_receita.aggregate(
            total=Sum(
                ExpressionWrapper(F('quantidade') * F('materia_prima__custo_por_unidade'), output_field=DecimalField()),
                default=0
            )
        )['total'] or 0
        return custo_materias_primas + self.custo_embalagem + self.custo_outros

class ReceitaItem(models.Model):
    produto_acabado = models.ForeignKey(ProdutoAcabado, on_delete=models.CASCADE, related_name='itens_receita')
    materia_prima = models.ForeignKey(MateriaPrima, on_delete=models.CASCADE)
    quantidade = models.DecimalField(max_digits=10, decimal_places=3)

    def __str__(self):
        return f"{self.quantidade} de {self.materia_prima.nome} para {self.produto_acabado.nome}"

# E assim por diante para Fornecedor, Cliente, Compra, Venda, e Despesa...
# Exemplo para Fornecedor:
class Fornecedor(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nome = models.CharField(max_length=200)
    contacto = models.CharField(max_length=50, blank=True)
    email = models.EmailField(max_length=254, blank=True)
    cnpj = models.CharField("CNPJ/CPF", max_length=20, blank=True)
    endereco = models.TextField(blank=True)
    notas = models.TextField(blank=True)

    class Meta:
        unique_together = ('usuario', 'nome')
        verbose_name_plural = "Fornecedores"

    def __str__(self):
        return f"{self.nome} ({self.usuario.username})"

class Cliente(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nome = models.CharField(max_length=200)
    contacto = models.CharField(max_length=50, blank=True)
    email = models.EmailField(max_length=254, blank=True)
    cpf = models.CharField("CPF", max_length=20, blank=True)
    endereco = models.TextField(blank=True)
    notas = models.TextField(blank=True)

    class Meta:
        unique_together = ('usuario', 'nome')

    def __str__(self):
        return f"{self.nome} ({self.usuario.username})"

class Compra(models.Model):
    materia_prima = models.ForeignKey(MateriaPrima, on_delete=models.CASCADE, related_name='compras')
    fornecedor = models.ForeignKey(Fornecedor, on_delete=models.SET_NULL, null=True, blank=True)
    data_compra = models.DateField(default=timezone.now)
    quantidade = models.DecimalField(max_digits=10, decimal_places=3)
    custo_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Compra de {self.materia_prima.nome} em {self.data_compra}"

class Venda(models.Model):
    STATUS_PAGAMENTO = [('Paga', 'Paga'), ('Pendente', 'Pendente'), ('Cancelada', 'Cancelada')]
    produto = models.ForeignKey(ProdutoAcabado, on_delete=models.PROTECT, related_name='vendas')
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)
    data_venda = models.DateTimeField(default=timezone.now)
    quantidade = models.PositiveIntegerField()
    preco_venda_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    custo_producao_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    desconto = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    forma_pagamento = models.CharField(max_length=50, default='N/D')
    status_pagamento = models.CharField(max_length=10, choices=STATUS_PAGAMENTO, default='Paga')

    def __str__(self):
        return f"Venda de {self.quantidade}x {self.produto.nome}"

class Despesa(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    data = models.DateField(default=timezone.now)
    descricao = models.CharField(max_length=255)
    categoria = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.descricao} - {self.valor}"