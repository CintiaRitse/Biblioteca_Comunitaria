from django.shortcuts import render
from datetime import date
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Livro, Leitor, Emprestimo

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
        data_prevista_devolucao='2026-09-22'
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

