from django.urls import path
from . import views

urlpatterns = [
    path(
        'emprestimos/<int:livro_id>/<int:leitor_id>/',
        views.realizar_emprestimo,
        name='realizar_emprestimo'
    ),
    path(
        'devolucoes/<int:emprestimo_id>/',
        views.devolver_livro,
        name='devolver_livro'
    ),
]