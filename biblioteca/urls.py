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
        'realizar-emprestimo/<int:livro_id>/<int:leitor_id>/',
        views.realizar_emprestimo,
        name='realizar_emprestimo'
    ),

    path(
        'devolver-livro/<int:emprestimo_id>/',
        views.devolver_livro,
        name='devolver_livro'
    ),
]