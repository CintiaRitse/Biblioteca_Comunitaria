from django.db import models

class Leitor(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20, blank=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome


class Livro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=150)
    categoria = models.CharField(max_length=100)
    isbn = models.CharField(max_length=13, unique=True)
    quantidade_total = models.PositiveIntegerField(default=1)
    quantidade_disponivel = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.titulo


class Emprestimo(models.Model):
    leitor = models.ForeignKey(
        Leitor,
        on_delete=models.CASCADE,
        related_name='emprestimos'
    )
    livro = models.ForeignKey(
        Livro,
        on_delete=models.CASCADE,
        related_name='emprestimos'
    )
    data_emprestimo = models.DateField(auto_now_add=True)
    data_prevista_devolucao = models.DateField()
    data_devolucao = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, default='ativo')

    def __str__(self):
        return f'{self.leitor} - {self.livro}'


class Reserva(models.Model):
    leitor = models.ForeignKey(
        Leitor,
        on_delete=models.CASCADE,
        related_name='reservas'
    )
    livro = models.ForeignKey(
        Livro,
        on_delete=models.CASCADE,
        related_name='reservas'
    )
    data_reserva = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='ativa')

    def __str__(self):
        return f'{self.leitor} - {self.livro}'
