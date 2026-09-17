from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .viewsets import (
    LivroViewSet,
    LeitorViewSet,
    EmprestimoViewSet,
    ReservaViewSet
)

router = DefaultRouter()

router.register('livros', LivroViewSet)
router.register('leitores', LeitorViewSet)
router.register('emprestimos', EmprestimoViewSet)
router.register('reservas', ReservaViewSet)

urlpatterns = [
    path('', include(router.urls)),

    path(
        'realizar-emprestimo/',
        views.realizar_emprestimo,
        name='realizar_emprestimo'
    ),

    path(
        'devolver-livro/',
        views.devolver_livro,
        name='devolver_livro'
    ),

    path(
        'realizar-reserva/',
        views.realizar_reserva,
        name='realizar_reserva'
    ),

    path(
        'emprestimos-atrasados/',
        views.listar_atrasados,
        name='listar_atrasados'
    ),
]