from datetime import date, timedelta

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Livro, Leitor, Emprestimo, Reserva


@api_view(['POST'])
def realizar_emprestimo(request):
    livro_id = request.data.get('livro_id')
    leitor_id = request.data.get('leitor_id')

    if not livro_id or not leitor_id:
        return Response(
            {'erro': 'livro_id e leitor_id são obrigatórios.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    livro = get_object_or_404(Livro, id=livro_id)
    leitor = get_object_or_404(Leitor, id=leitor_id)

    if livro.quantidade_disponivel <= 0:
        return Response(
            {'erro': 'Livro indisponível para empréstimo.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    emprestimo = Emprestimo.objects.create(
        leitor=leitor,
        livro=livro,
        data_prevista_devolucao=date.today() + timedelta(days=7)
    )

    livro.quantidade_disponivel -= 1
    livro.save()

    return Response({
        'mensagem': 'Empréstimo realizado com sucesso.',
        'emprestimo_id': emprestimo.id,
        'data_prevista_devolucao': emprestimo.data_prevista_devolucao
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def devolver_livro(request):
    emprestimo_id = request.data.get('emprestimo_id')

    if not emprestimo_id:
        return Response(
            {'erro': 'emprestimo_id é obrigatório.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    emprestimo = get_object_or_404(
        Emprestimo,
        id=emprestimo_id
    )

    if emprestimo.status == 'devolvido':
        return Response(
            {'erro': 'Este livro já foi devolvido.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    emprestimo.status = 'devolvido'
    emprestimo.data_devolucao = date.today()
    emprestimo.save()

    livro = emprestimo.livro

    if livro.quantidade_disponivel < livro.quantidade_total:
        livro.quantidade_disponivel += 1
        livro.save()

    return Response({
        'mensagem': 'Livro devolvido com sucesso.'
    })


@api_view(['POST'])
def realizar_reserva(request):
    livro_id = request.data.get('livro_id')
    leitor_id = request.data.get('leitor_id')

    if not livro_id or not leitor_id:
        return Response(
            {'erro': 'livro_id e leitor_id são obrigatórios.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    livro = get_object_or_404(Livro, id=livro_id)
    leitor = get_object_or_404(Leitor, id=leitor_id)

    reserva_existente = Reserva.objects.filter(
        leitor=leitor,
        livro=livro,
        status='ativa'
    ).exists()

    if reserva_existente:
        return Response(
            {'erro': 'Este leitor já possui uma reserva ativa para este livro.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    reserva = Reserva.objects.create(
        leitor=leitor,
        livro=livro
    )

    return Response({
        'mensagem': 'Reserva realizada com sucesso.',
        'reserva_id': reserva.id
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def listar_atrasados(request):
    emprestimos = Emprestimo.objects.filter(
        data_prevista_devolucao__lt=date.today(),
        status='ativo'
    )

    dados = []

    for emprestimo in emprestimos:
        dados.append({
            'id': emprestimo.id,
            'leitor': emprestimo.leitor.nome,
            'livro': emprestimo.livro.titulo,
            'data_prevista_devolucao': emprestimo.data_prevista_devolucao
        })

    return Response({
        'emprestimos_atrasados': dados
    })