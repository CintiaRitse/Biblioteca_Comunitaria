from django.contrib import admin
from .models import Leitor, Livro, Emprestimo, Reserva

admin.site.register(Leitor)
admin.site.register(Livro)
admin.site.register(Emprestimo)
admin.site.register(Reserva)