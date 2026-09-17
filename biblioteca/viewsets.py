from rest_framework import viewsets, filters
from .models import Livro, Leitor, Emprestimo, Reserva
from .serializers import (
    LivroSerializer,
    LeitorSerializer,
    EmprestimoSerializer,
    ReservaSerializer
)


class LivroViewSet(viewsets.ModelViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['titulo', 'autor', 'categoria', 'isbn']


class LeitorViewSet(viewsets.ModelViewSet):
    queryset = Leitor.objects.all()
    serializer_class = LeitorSerializer


class EmprestimoViewSet(viewsets.ModelViewSet):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoSerializer


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer