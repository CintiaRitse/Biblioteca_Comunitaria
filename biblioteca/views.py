from datetime import date, timedelta
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Livro, Leitor, Emprestimo, Reserva

def realizar_emprestimo(request, livro_id, leitor_id):
    livro = get_object_or_404(Livro, id=livro_id)
    leitor = get_object_or_404(Leitor, id=leitor_id)
    if livro.quantidade_disponivel <= 0:
        return JsonResponse({
            'erro': 'Livro indisponível para empréstimo.'
        }, status=400)


    emprestimo = Emprestimo.objects.create(
        leitor=leitor,
        livro=livro,
        data_prevista_devolucao=date.today() + timedelta(days=7)
    )

   
    livro.quantidade_disponivel -= 1
    livro.save()

    return JsonResponse({
        'mensagem': 'Empréstimo realizado com sucesso.',
        'emprestimo_id': emprestimo.id
    })
def devolver_livro(request, emprestimo_id):
    emprestimo = get_object_or_404(
        Emprestimo,
        id=emprestimo_id
    )
    if emprestimo.status == 'devolvido':
        return JsonResponse({
            'erro': 'Este livro já foi devolvido.'
        }, status=400)

    emprestimo.status = 'devolvido'
    emprestimo.data_devolucao = date.today()
    emprestimo.save()
    livro = emprestimo.livro
    livro.quantidade_disponivel += 1
    livro.save()

    return JsonResponse({
        'mensagem': 'Livro devolvido com sucesso.'
    })

@require_POST
def realizar_reserva(request, livro_id, leitor_id):
    livro = get_object_or_404(Livro, id=livro_id)
    leitor = get_object_or_404(Leitor, id=leitor_id)

    reserva_existente = Reserva.objects.filter(
        leitor=leitor,
        livro=livro,
        status='ativa'
    ).exists()

    if reserva_existente:
        return JsonResponse({
            'erro': 'Este leitor já possui uma reserva ativa para este livro.'
        }, status=400)

    reserva = Reserva.objects.create(
        leitor=leitor,
        livro=livro
    )

    return JsonResponse({
        'mensagem': 'Reserva realizada com sucesso.',
        'reserva_id': reserva.id
    }, status=201)

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

    return JsonResponse({
        'emprestimos_atrasados': dados
    })