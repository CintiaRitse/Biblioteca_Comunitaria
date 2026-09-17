(function () {
  "use strict";

  const API_URL = "/api";

  function getCookie(name) {
    var cookieValue = null;

    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var item = cookies[i].trim();

        if (item.indexOf(name + "=") === 0) {
          cookieValue = decodeURIComponent(
            item.substring(name.length + 1)
          );
          break;
        }
      }
    }

    return cookieValue;
  }

  async function apiRequest(endpoint, options = {}) {
    var response = await fetch(API_URL + endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken") || "",
        ...(options.headers || {})
      }
    });

    var data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.erro ||
        data.detail ||
        "Erro ao comunicar com o servidor."
      );
    }

    return data;
  }

  async function cadastrarLivroAPI(livro) {
    return apiRequest("/livros/", {
      method: "POST",
      body: JSON.stringify(livro)
    });
  }

  async function cadastrarLeitorAPI(leitor) {
    return apiRequest("/leitores/", {
      method: "POST",
      body: JSON.stringify(leitor)
    });
  }

  async function realizarEmprestimoAPI(livroId, leitorId) {
    return apiRequest("/realizar-emprestimo/", {
      method: "POST",
      body: JSON.stringify({
        livro_id: livroId,
        leitor_id: leitorId
      })
    });
  }

  async function devolverLivroAPI(emprestimoId) {
    return apiRequest("/devolver-livro/", {
      method: "POST",
      body: JSON.stringify({
        emprestimo_id: emprestimoId
      })
    });
  }

  async function realizarReservaAPI(livroId, leitorId) {
    return apiRequest("/realizar-reserva/", {
      method: "POST",
      body: JSON.stringify({
        livro_id: livroId,
        leitor_id: leitorId
      })
    });
  }

  var STORAGE_KEY = "ponto_leitura_biblioteca_v1";
  var LOAN_DAYS = 14;

  var todayISO = new Date().toISOString().slice(0, 10);
  var today = new Date(todayISO);

  function daysBetween(a, b) {
    var msPerDay = 86400000;

    return Math.round(
      (new Date(b) - new Date(a)) / msPerDay
    );
  }

  function addDays(dateStr, n) {
    var d = new Date(dateStr);

    d.setDate(d.getDate() + n);

    return d.toISOString().slice(0, 10);
  }

  function fmtDate(iso) {
    var d = new Date(iso);

    var dd = String(d.getUTCDate()).padStart(2, "0");
    var mm = String(d.getUTCMonth() + 1).padStart(2, "0");

    return (
      dd +
      "/" +
      mm +
      "/" +
      d.getUTCFullYear()
    );
  }

  function uid(prefix) {
    return (
      prefix +
      "_" +
      Math.random().toString(36).slice(2, 9)
    );
  }

  function seedData() {
    var books = [
      {
        id: "b1",
        title: "Dom Casmurro",
        author: "Machado de Assis",
        category: "Romance",
        copies: 3,
        timesLoaned: 5
      },
      {
        id: "b2",
        title: "Grande Sertão: Veredas",
        author: "Guimarães Rosa",
        category: "Romance",
        copies: 2,
        timesLoaned: 2
      },
      {
        id: "b3",
        title: "Capitães da Areia",
        author: "Jorge Amado",
        category: "Romance",
        copies: 2,
        timesLoaned: 4
      },
      {
        id: "b4",
        title: "O Cortiço",
        author: "Aluísio Azevedo",
        category: "Romance",
        copies: 2,
        timesLoaned: 1
      },
      {
        id: "b5",
        title: "Vidas Secas",
        author: "Graciliano Ramos",
        category: "Romance",
        copies: 1,
        timesLoaned: 3
      },
      {
        id: "b6",
        title: "Torto Arado",
        author: "Itamar Vieira Junior",
        category: "Romance",
        copies: 2,
        timesLoaned: 6
      },
      {
        id: "b7",
        title: "Quarto de Despejo",
        author: "Carolina Maria de Jesus",
        category: "Biografia",
        copies: 1,
        timesLoaned: 2
      },
      {
        id: "b8",
        title: "Sapiens: Uma Breve História da Humanidade",
        author: "Yuval Noah Harari",
        category: "Não-ficção",
        copies: 2,
        timesLoaned: 7
      },
      {
        id: "b9",
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        category: "Infantil",
        copies: 3,
        timesLoaned: 8
      },
      {
        id: "b10",
        title: "Harry Potter e a Pedra Filosofal",
        author: "J.K. Rowling",
        category: "Infantojuvenil",
        copies: 2,
        timesLoaned: 9
      },
      {
        id: "b11",
        title: "1984",
        author: "George Orwell",
        category: "Ficção científica",
        copies: 2,
        timesLoaned: 6
      },
      {
        id: "b12",
        title: "A Menina que Roubava Livros",
        author: "Markus Zusak",
        category: "Romance",
        copies: 1,
        timesLoaned: 3
      },
      {
        id: "b13",
        title: "Cem Anos de Solidão",
        author: "Gabriel García Márquez",
        category: "Romance",
        copies: 1,
        timesLoaned: 4
      },
      {
        id: "b14",
        title: "Introdução à Lógica de Programação",
        author: "Equipe Como Livros",
        category: "Técnico",
        copies: 2,
        timesLoaned: 2
      }
    ];

    var readers = [
      {
        id: "r1",
        name: "Ana Beatriz Souza",
        type: "Estudante",
        email: "ana.souza@email.com",
        phone: "(83) 99111-2233",
        since: "2026-02-10"
      },
      {
        id: "r2",
        name: "Carlos Eduardo Lima",
        type: "Morador",
        email: "carlos.lima@email.com",
        phone: "(83) 99222-3344",
        since: "2026-03-04"
      },
      {
        id: "r3",
        name: "Fernanda Ribeiro",
        type: "Estudante",
        email: "fernanda.r@email.com",
        phone: "(83) 99333-4455",
        since: "2026-05-19"
      },
      {
        id: "r4",
        name: "João Pedro Alves",
        type: "Visitante",
        email: "joao.alves@email.com",
        phone: "(83) 99444-5566",
        since: "2026-07-01"
      }
    ];

    var loans = [];
    var reservations = [];

    return {
      books: books,
      readers: readers,
      loans: loans,
      reservations: reservations
    };
  }

  var store = loadStore();

  async function carregarDadosAPI() {
    try {
      var [
        livros,
        leitores,
        emprestimos,
        reservas
      ] = await Promise.all([
        apiRequest("/livros/"),
        apiRequest("/leitores/"),
        apiRequest("/emprestimos/"),
        apiRequest("/reservas/")
      ]);

      store.books = livros.map(function (livro) {
        return {
          id: String(livro.id),
          title: livro.titulo,
          author: livro.autor,
          category: livro.categoria,
          copies: livro.quantidade_total,
          available: livro.quantidade_disponivel,
          timesLoaned: 0
        };
      });

      store.readers = leitores.map(function (leitor) {
        return {
          id: String(leitor.id),
          name: leitor.nome,
          type: "Leitor",
          email: leitor.email,
          phone: leitor.telefone,
          since: leitor.data_cadastro
            ? leitor.data_cadastro.slice(0, 10)
            : todayISO
        };
      });

      store.loans = emprestimos.map(function (emprestimo) {
        return {
          id: String(emprestimo.id),
          bookId: String(emprestimo.livro),
          readerId: String(emprestimo.leitor),
          loanDate: emprestimo.data_emprestimo,
          dueDate: emprestimo.data_prevista_devolucao,
          returnDate: emprestimo.data_devolucao
        };
      });

      store.reservations = reservas.map(function (reserva) {
        return {
          id: String(reserva.id),
          bookId: String(reserva.livro),
          readerId: String(reserva.leitor),
          date: reserva.data_reserva.slice(0, 10),
          status:
            reserva.status === "ativa"
              ? "aguardando"
              : reserva.status
        };
      });

      store.books.forEach(function (book) {
        book.timesLoaned = store.loans.filter(
          function (loan) {
            return loan.bookId === book.id;
          }
        ).length;
      });
    } catch (error) {
      console.error(error);

      toast(
        "Não foi possível carregar os dados do servidor."
      );
    }
  }

  function loadStore() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        var parsed = JSON.parse(raw);

        if (
          parsed &&
          parsed.books &&
          parsed.readers
        ) {
          return parsed;
        }
      }
    } catch (e) {}

    return seedData();
  }

  function saveStore() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(store)
      );
    } catch (e) {}
  }

  function bookById(id) {
    return store.books.find(function (b) {
      return b.id === id;
    });
  }

  function readerById(id) {
    return store.readers.find(function (r) {
      return r.id === id;
    });
  }

  function activeLoansFor(bookId) {
    return store.loans.filter(function (l) {
      return (
        l.bookId === bookId &&
        !l.returnDate
      );
    });
  }

  function availableCopies(book) {
    if (typeof book.available === "number") {
      return book.available;
    }

    return (
      book.copies -
      activeLoansFor(book.id).length
    );
  }
    function loanStatus(loan) {
    var diff = daysBetween(todayISO, loan.dueDate);

    if (diff < 0) return "late";
    if (diff <= 2) return "soon";

    return "fine";
  }

  function pendingReservationsFor(bookId) {
    return store.reservations.filter(function (r) {
      return (
        r.bookId === bookId &&
        r.status === "aguardando"
      );
    });
  }

  var TABS = {
    leitor: [
      { id: "catalogo", label: "Catálogo" },
      { id: "conta", label: "Minha conta" },
      { id: "cadastro", label: "Cadastrar-se" }
    ],

    funcionario: [
      { id: "painel", label: "Painel" },
      { id: "catalogo", label: "Catálogo" },
      { id: "emprestimos", label: "Empréstimos" },
      { id: "reservas-staff", label: "Reservas" },
      { id: "leitores", label: "Leitores" },
      { id: "acervo", label: "Acervo" }
    ]
  };

  var currentRole = "leitor";
  var currentView = "catalogo";

  var currentReaderId =
    store.readers[0]
      ? store.readers[0].id
      : null;

  function renderTabs() {
    var host = document.getElementById("tabsInner");

    host.innerHTML = "";

    TABS[currentRole].forEach(function (t) {
      var btn = document.createElement("button");

      btn.textContent = t.label;
      btn.dataset.view = t.id;

      if (t.id === currentView) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", function () {
        setView(t.id);
      });

      host.appendChild(btn);
    });
  }

  function setView(viewId) {
    currentView = viewId;

    document
      .querySelectorAll("section.view")
      .forEach(function (s) {
        s.classList.remove("active");
      });

    var el = document.getElementById(
      "view-" + viewId
    );

    if (el) {
      el.classList.add("active");
    }

    renderTabs();
    renderAllForView(viewId);
  }

  function setRole(role) {
    currentRole = role;

    document
      .querySelectorAll("#roleSwitch button")
      .forEach(function (b) {
        b.classList.toggle(
          "active",
          b.dataset.role === role
        );
      });

    var firstView = TABS[role][0].id;

    setView(firstView);
  }

  document
    .getElementById("roleSwitch")
    .addEventListener("click", function (e) {
      var btn = e.target.closest(
        "button[data-role]"
      );

      if (btn) {
        setRole(btn.dataset.role);
      }
    });

  function toast(msg) {
    var host =
      document.getElementById("toastHost");

    var el = document.createElement("div");

    el.className = "toast";
    el.textContent = msg;

    host.appendChild(el);

    setTimeout(function () {
      el.remove();
    }, 3600);
  }

  function renderNotices() {
    var bar =
      document.getElementById("noticeBar");

    bar.innerHTML = "";

    var items = [];

    if (
      currentRole === "leitor" &&
      currentReaderId
    ) {
      var myLate = store.loans.filter(
        function (l) {
          return (
            l.readerId === currentReaderId &&
            !l.returnDate &&
            loanStatus(l) === "late"
          );
        }
      );

      var mySoon = store.loans.filter(
        function (l) {
          return (
            l.readerId === currentReaderId &&
            !l.returnDate &&
            loanStatus(l) === "soon"
          );
        }
      );

      myLate.forEach(function (l) {
        var b = bookById(l.bookId);

        if (!b) return;

        items.push({
          type: "warn",
          html:
            "<b>" +
            b.title +
            "</b> está atrasado desde " +
            fmtDate(l.dueDate) +
            "."
        });
      });

      mySoon.forEach(function (l) {
        var b = bookById(l.bookId);

        if (!b) return;

        items.push({
          type: "info",
          html:
            "<b>" +
            b.title +
            "</b> vence em " +
            fmtDate(l.dueDate) +
            " — devolva a tempo para evitar atraso."
        });
      });

      store.reservations
        .filter(function (r) {
          return (
            r.readerId === currentReaderId &&
            r.status === "aguardando"
          );
        })
        .forEach(function (r) {
          var b = bookById(r.bookId);

          if (
            b &&
            availableCopies(b) > 0
          ) {
            items.push({
              type: "ok",
              html:
                "<b>" +
                b.title +
                "</b> já está disponível para retirada — sua reserva é a próxima da fila."
            });
          }
        });
    }

    if (currentRole === "funcionario") {
      var lateCount = store.loans.filter(
        function (l) {
          return (
            !l.returnDate &&
            loanStatus(l) === "late"
          );
        }
      ).length;

      var soonCount = store.loans.filter(
        function (l) {
          return (
            !l.returnDate &&
            loanStatus(l) === "soon"
          );
        }
      ).length;

      var readyReservations =
        store.reservations.filter(
          function (r) {
            var b = bookById(r.bookId);

            return (
              r.status === "aguardando" &&
              b &&
              availableCopies(b) > 0
            );
          }
        );

      if (lateCount > 0) {
        items.push({
          type: "warn",
          html:
            "<b>" +
            lateCount +
            "</b> empréstimo(s) em atraso — veja a aba Empréstimos."
        });
      }

      if (soonCount > 0) {
        items.push({
          type: "info",
          html:
            "<b>" +
            soonCount +
            "</b> empréstimo(s) vencem nos próximos 2 dias."
        });
      }

      if (readyReservations.length > 0) {
        items.push({
          type: "ok",
          html:
            "<b>" +
            readyReservations.length +
            "</b> reserva(s) prontas para avisar o leitor."
        });
      }
    }

    if (items.length === 0) {
      bar.style.display = "none";
      return;
    }

    bar.style.display = "flex";

    items.forEach(function (it) {
      var d = document.createElement("div");

      d.className = "notice " + it.type;

      d.innerHTML =
        '<span class="dot"></span>' +
        "<span>" +
        it.html +
        "</span>";

      bar.appendChild(d);
    });
  }

  function renderCategoryFilter() {
    var sel =
      document.getElementById("categoryFilter");

    var cats = Array.from(
      new Set(
        store.books.map(function (b) {
          return b.category;
        })
      )
    ).sort();

    sel.innerHTML =
      '<option value="todas">Todas as categorias</option>' +
      cats
        .map(function (c) {
          return (
            '<option value="' +
            c +
            '">' +
            c +
            "</option>"
          );
        })
        .join("");
  }

  function renderCatalogo() {
    var grid =
      document.getElementById("bookGrid");

    var q = document
      .getElementById("searchInput")
      .value
      .trim()
      .toLowerCase();

    var cat =
      document.getElementById(
        "categoryFilter"
      ).value;

    var avail =
      document.getElementById(
        "availFilter"
      ).value;

    var list = store.books.filter(
      function (b) {
        var matchesQ =
          !q ||
          b.title
            .toLowerCase()
            .indexOf(q) !== -1 ||
          b.author
            .toLowerCase()
            .indexOf(q) !== -1;

        var matchesCat =
          cat === "todas" ||
          b.category === cat;

        var free = availableCopies(b);

        var matchesAvail =
          avail === "todos" ||
          (
            avail === "disponivel" &&
            free > 0
          ) ||
          (
            avail === "indisponivel" &&
            free <= 0
          );

        return (
          matchesQ &&
          matchesCat &&
          matchesAvail
        );
      }
    );

    grid.innerHTML = "";

    if (list.length === 0) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1;">' +
        '<div class="icon">📭</div>' +
        "Nenhum título encontrado com esses filtros." +
        "</div>";

      return;
    }

    list.forEach(function (b) {
      var free = availableCopies(b);
      var card =
        document.createElement("div");

      card.className = "book-card";

      var actionHtml;

      if (currentRole === "leitor") {
        if (free > 0) {
          actionHtml =
            '<span class="copies-note">' +
            free +
            " de " +
            b.copies +
            " disp.</span>";
        } else {
          var queue =
            pendingReservationsFor(
              b.id
            ).length;

          actionHtml =
            '<button class="btn small secondary" data-reserve="' +
            b.id +
            '">' +
            "Reservar" +
            (
              queue > 0
                ? ' <span class="queue-tag">(' +
                  queue +
                  " na fila)</span>"
                : ""
            ) +
            "</button>";
        }
      } else {
        actionHtml =
          '<span class="copies-note">' +
          free +
          " de " +
          b.copies +
          " disp.</span>";
      }

      card.innerHTML =
        '<span class="cat">' +
        b.category +
        "</span>" +
        "<h3>" +
        b.title +
        "</h3>" +
        '<p class="author">' +
        b.author +
        "</p>" +
        '<div class="avail-row">' +
        '<span class="badge ' +
        (free > 0 ? "ok" : "out") +
        '">' +
        (
          free > 0
            ? "Disponível"
            : "Indisponível"
        ) +
        "</span>" +
        "</div>" +
        '<div class="avail-row" style="border-top:none;padding-top:0;">' +
        actionHtml +
        "</div>";

      grid.appendChild(card);
    });

    grid
      .querySelectorAll("[data-reserve]")
      .forEach(function (btn) {
        btn.addEventListener(
          "click",
          function () {
            openReserveModal(
              btn.dataset.reserve
            );
          }
        );
      });
  }

  function renderReaderSelect() {
    var sel =
      document.getElementById("readerSelect");

    sel.innerHTML = store.readers
      .map(function (r) {
        return (
          '<option value="' +
          r.id +
          '">' +
          r.name +
          " — " +
          r.type +
          "</option>"
        );
      })
      .join("");

    if (currentReaderId) {
      sel.value = currentReaderId;
    }
  }

  document
    .getElementById("readerSelect")
    .addEventListener(
      "change",
      function (e) {
        currentReaderId =
          e.target.value;

        renderConta();
        renderNotices();
      }
    );

  function renderConta() {
    var loansHost =
      document.getElementById("myLoans");

    var resHost =
      document.getElementById(
        "myReservations"
      );

    if (!currentReaderId) {
      loansHost.innerHTML =
        '<p class="muted">Cadastre-se para acompanhar seus empréstimos.</p>';

      resHost.innerHTML = "";

      return;
    }

    var myLoans = store.loans.filter(
      function (l) {
        return (
          l.readerId ===
            currentReaderId &&
          !l.returnDate
        );
      }
    );

    var myRes =
      store.reservations.filter(
        function (r) {
          return (
            r.readerId ===
            currentReaderId
          );
        }
      );

    loansHost.innerHTML =
      myLoans.length === 0
        ? '<p class="muted">Nenhum empréstimo em andamento.</p>'
        : myLoans
            .map(function (l) {
              var b =
                bookById(l.bookId);

              if (!b) return "";

              var status =
                loanStatus(l);

              var pillClass =
                status === "late"
                  ? "late"
                  : status === "soon"
                    ? "soon"
                    : "fine";

              var pillText =
                status === "late"
                  ? "Atrasado"
                  : "Devolver até " +
                    fmtDate(
                      l.dueDate
                    );

              return (
                '<div style="padding:10px 0;border-bottom:1px solid var(--line);">' +
                '<div style="font-weight:600;font-size:13.5px;">' +
                b.title +
                "</div>" +
                '<div class="due-pill ' +
                pillClass +
                '" style="margin-top:6px;">' +
                pillText +
                "</div>" +
                "</div>"
              );
            })
            .join("");

    resHost.innerHTML =
      myRes.length === 0
        ? '<p class="muted">Nenhuma reserva ativa.</p>'
        : myRes
            .map(function (r) {
              var b =
                bookById(r.bookId);

              if (!b) return "";

              var free =
                availableCopies(b);

              var queue =
                pendingReservationsFor(
                  b.id
                );

              var position =
                queue.findIndex(
                  function (q) {
                    return (
                      q.id === r.id
                    );
                  }
                ) + 1;

              var ready =
                r.status ===
                  "aguardando" &&
                free > 0;

              return (
                '<div style="padding:10px 0;border-bottom:1px solid var(--line);">' +
                '<div style="font-weight:600;font-size:13.5px;">' +
                b.title +
                "</div>" +
                (
                  r.status ===
                  "cancelada"
                    ? '<div class="muted" style="font-size:12.5px;margin-top:4px;">Cancelada</div>'
                    : ready
                      ? '<div class="due-pill fine" style="margin-top:6px;">Pronta para retirada</div>'
                      : '<div class="queue-tag" style="margin-top:6px;display:block;">Posição na fila: ' +
                        position +
                        "</div>"
                ) +
                "</div>"
              );
            })
            .join("");
  }
    document
    .getElementById("btnRegisterReader")
    .addEventListener("click", async function () {
      var name = document
        .getElementById("newReaderName")
        .value.trim();

      var email = document
        .getElementById("newReaderEmail")
        .value.trim();

      var phone = document
        .getElementById("newReaderPhone")
        .value.trim();

      if (!name) {
        toast("Informe o nome do leitor.");
        return;
      }

      if (!email) {
        toast("Informe o e-mail do leitor.");
        return;
      }

      try {
        var reader =
          await cadastrarLeitorAPI({
            nome: name,
            email: email,
            telefone: phone
          });

        toast(
          "Cadastro concluído — bem-vindo(a), " +
          name.split(" ")[0] +
          "!"
        );

        document.getElementById(
          "newReaderName"
        ).value = "";

        document.getElementById(
          "newReaderEmail"
        ).value = "";

        document.getElementById(
          "newReaderPhone"
        ).value = "";

        currentReaderId =
          String(reader.id);

        await carregarDadosAPI();

        if (currentRole === "leitor") {
          setView("conta");
        }
      } catch (error) {
        toast(error.message);
      }
    });

  function renderPainel() {
    var totalTitles =
      store.books.length;

    var totalBooks =
      store.books.reduce(
        function (sum, b) {
          return sum + b.copies;
        },
        0
      );

    var activeLoans =
      store.loans.filter(
        function (l) {
          return !l.returnDate;
        }
      ).length;

    var lateLoans =
      store.loans.filter(
        function (l) {
          return (
            !l.returnDate &&
            loanStatus(l) === "late"
          );
        }
      ).length;

    var readers =
      store.readers.length;

    var stats = [
      {
        num: totalTitles,
        lbl: "Títulos no acervo",
        cls: "pine"
      },
      {
        num: totalBooks,
        lbl: "Exemplares totais",
        cls: "pine"
      },
      {
        num: activeLoans,
        lbl: "Empréstimos ativos",
        cls: "ochre"
      },
      {
        num: lateLoans,
        lbl: "Empréstimos atrasados",
        cls: "stamp"
      },
      {
        num: readers,
        lbl: "Leitores cadastrados",
        cls: "pine"
      }
    ];

    document.getElementById(
      "statGrid"
    ).innerHTML = stats
      .map(function (s) {
        return (
          '<div class="stat-card ' +
          s.cls +
          '">' +
          '<div class="num">' +
          s.num +
          "</div>" +
          '<div class="lbl">' +
          s.lbl +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    var ranked =
      store.books
        .slice()
        .sort(function (a, b) {
          return (
            b.timesLoaned -
            a.timesLoaned
          );
        })
        .slice(0, 6);

    var max =
      ranked.length
        ? ranked[0].timesLoaned
        : 1;

    document.getElementById(
      "rankList"
    ).innerHTML = ranked
      .map(function (b) {
        var pct =
          max > 0
            ? Math.round(
                (b.timesLoaned / max) *
                  100
              )
            : 0;

        return (
          "<li>" +
          '<div class="rank-bar-wrap">' +
          '<div class="rank-title">' +
          b.title +
          "</div>" +
          '<div class="rank-bar-bg">' +
          '<div class="rank-bar-fill" style="width:' +
          pct +
          '%;"></div>' +
          "</div>" +
          "</div>" +
          '<div class="rank-count">' +
          b.timesLoaned +
          "x</div>" +
          "</li>"
        );
      })
      .join("");

    var noticesHost =
      document.getElementById(
        "panelNotices"
      );

    var late =
      store.loans.filter(
        function (l) {
          return (
            !l.returnDate &&
            loanStatus(l) === "late"
          );
        }
      );

    var ready =
      store.reservations.filter(
        function (r) {
          var b =
            bookById(r.bookId);

          return (
            r.status === "aguardando" &&
            b &&
            availableCopies(b) > 0
          );
        }
      );

    var htmlBits = [];

    late.forEach(function (l) {
      var b =
        bookById(l.bookId);

      var r =
        readerById(l.readerId);

      if (!b || !r) return;

      htmlBits.push(
        '<div class="notice warn">' +
        '<span class="dot"></span>' +
        "<span><b>" +
        r.name +
        '</b> está com "' +
        b.title +
        '" atrasado desde ' +
        fmtDate(l.dueDate) +
        ".</span>" +
        "</div>"
      );
    });

    ready.forEach(function (res) {
      var b =
        bookById(res.bookId);

      var r =
        readerById(res.readerId);

      if (!b || !r) return;

      htmlBits.push(
        '<div class="notice ok">' +
        '<span class="dot"></span>' +
        "<span>Avisar <b>" +
        r.name +
        '</b>: "' +
        b.title +
        '" está disponível.</span>' +
        "</div>"
      );
    });

    noticesHost.innerHTML =
      htmlBits.length
        ? htmlBits.join("")
        : '<p class="muted">Nenhum aviso pendente hoje.</p>';
  }

  function renderLoansTable() {
    var tbody =
      document.getElementById(
        "loansTable"
      );

    var active =
      store.loans
        .filter(function (l) {
          return !l.returnDate;
        })
        .sort(function (a, b) {
          return (
            new Date(a.dueDate) -
            new Date(b.dueDate)
          );
        });

    if (active.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6">' +
        '<div class="empty-state">' +
        '<div class="icon">📚</div>' +
        "Nenhum empréstimo em andamento." +
        "</div>" +
        "</td></tr>";

      return;
    }

    tbody.innerHTML = active
      .map(function (l) {
        var b =
          bookById(l.bookId);

        var r =
          readerById(l.readerId);

        if (!b || !r) return "";

        var status =
          loanStatus(l);

        var pillClass =
          status === "late"
            ? "late"
            : status === "soon"
              ? "soon"
              : "fine";

        var pillText =
          status === "late"
            ? "Atrasado"
            : status === "soon"
              ? "Vence logo"
              : "Em dia";

        return (
          "<tr>" +
          "<td>" +
          b.title +
          "</td>" +
          "<td>" +
          r.name +
          "</td>" +
          "<td>" +
          fmtDate(l.loanDate) +
          "</td>" +
          "<td>" +
          fmtDate(l.dueDate) +
          "</td>" +
          '<td><span class="due-pill ' +
          pillClass +
          '">' +
          pillText +
          "</span></td>" +
          '<td><button class="btn small stamp" data-return="' +
          l.id +
          '">' +
          "Registrar devolução" +
          "</button></td>" +
          "</tr>"
        );
      })
      .join("");

    tbody
      .querySelectorAll(
        "[data-return]"
      )
      .forEach(function (btn) {
        btn.addEventListener(
          "click",
          function () {
            registerReturn(
              btn.dataset.return
            );
          }
        );
      });
  }

  async function registerReturn(loanId) {
    try {
      var resultado =
        await devolverLivroAPI(
          loanId
        );

      toast(resultado.mensagem);

      await carregarDadosAPI();

      refreshCurrentView();
    } catch (error) {
      toast(error.message);
    }
  }

  document
    .getElementById("btnNewLoan")
    .addEventListener(
      "click",
      openLoanModal
    );

  function openLoanModal() {
    var readerSel =
      document.getElementById(
        "loanReader"
      );

    var bookSel =
      document.getElementById(
        "loanBook"
      );

    readerSel.innerHTML =
      store.readers
        .map(function (r) {
          return (
            '<option value="' +
            r.id +
            '">' +
            r.name +
            "</option>"
          );
        })
        .join("");

    var availableBooks =
      store.books.filter(
        function (b) {
          return (
            availableCopies(b) > 0
          );
        }
      );

    if (
      store.readers.length === 0
    ) {
      readerSel.innerHTML =
        '<option value="">Nenhum leitor cadastrado</option>';
    }

    if (
      availableBooks.length === 0
    ) {
      bookSel.innerHTML =
        '<option value="">Nenhum título disponível</option>';
    } else {
      bookSel.innerHTML =
        availableBooks
          .map(function (b) {
            return (
              '<option value="' +
              b.id +
              '">' +
              b.title +
              " (" +
              availableCopies(b) +
              " disp.)</option>"
            );
          })
          .join("");
    }

    openModal("modalLoan");
  }

  document
    .getElementById("confirmLoan")
    .addEventListener(
      "click",
      async function () {
        var readerId =
          document.getElementById(
            "loanReader"
          ).value;

        var bookId =
          document.getElementById(
            "loanBook"
          ).value;

        if (
          !readerId ||
          !bookId
        ) {
          toast(
            "Selecione um leitor e um livro disponível."
          );

          return;
        }

        try {
          var resultado =
            await realizarEmprestimoAPI(
              bookId,
              readerId
            );

          closeModal(
            "modalLoan"
          );

          toast(
            resultado.mensagem
          );

          await carregarDadosAPI();

          refreshCurrentView();
        } catch (error) {
          toast(error.message);
        }
      }
    );

  function openReserveModal(bookId) {
    var b =
      bookById(bookId);

    if (!b) {
      toast(
        "Livro não encontrado."
      );
      return;
    }

    document.getElementById(
      "reserveBookName"
    ).textContent =
      b.title +
      " — " +
      b.author;

    var sel =
      document.getElementById(
        "reserveReader"
      );

    sel.innerHTML =
      store.readers
        .map(function (r) {
          return (
            '<option value="' +
            r.id +
            '">' +
            r.name +
            "</option>"
          );
        })
        .join("");

    if (currentReaderId) {
      sel.value =
        currentReaderId;
    }

    sel.dataset.bookId =
      bookId;

    openModal(
      "modalReserve"
    );
  }

  document
    .getElementById(
      "confirmReserve"
    )
    .addEventListener(
      "click",
      async function () {
        var sel =
          document.getElementById(
            "reserveReader"
          );

        var readerId =
          sel.value;

        var bookId =
          sel.dataset.bookId;

        if (
          !readerId ||
          !bookId
        ) {
          toast(
            "Selecione um leitor."
          );

          return;
        }

        try {
          var resultado =
            await realizarReservaAPI(
              bookId,
              readerId
            );

          closeModal(
            "modalReserve"
          );

          toast(
            resultado.mensagem
          );

          await carregarDadosAPI();

          refreshCurrentView();
        } catch (error) {
          toast(error.message);
        }
      }
    );

      function renderReservationsTable() {
    var tbody = document.getElementById("reservationsTable");

    var list = store.reservations
      .filter(function (r) {
        return r.status === "aguardando";
      })
      .sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });

    if (list.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6">' +
        '<div class="empty-state">' +
        '<div class="icon">🔖</div>' +
        "Nenhuma reserva pendente." +
        "</div>" +
        "</td></tr>";

      return;
    }

    tbody.innerHTML = list
      .map(function (r) {
        var b = bookById(r.bookId);
        var rd = readerById(r.readerId);

        if (!b || !rd) {
          return "";
        }

        var queue = pendingReservationsFor(b.id);

        var position =
          queue.findIndex(function (q) {
            return q.id === r.id;
          }) + 1;

        var free = availableCopies(b);

        var statusHtml =
          free > 0 && position === 1
            ? '<span class="due-pill fine">Pronta para retirada</span>'
            : '<span class="queue-tag">Aguardando exemplar</span>';

        return (
          "<tr>" +
          "<td>" +
          b.title +
          "</td>" +
          "<td>" +
          rd.name +
          "</td>" +
          "<td>" +
          fmtDate(r.date) +
          "</td>" +
          "<td>" +
          position +
          "º</td>" +
          "<td>" +
          statusHtml +
          "</td>" +
          '<td><button class="btn small ghost" data-cancel-res="' +
          r.id +
          '">Cancelar</button></td>' +
          "</tr>"
        );
      })
      .join("");

    tbody
      .querySelectorAll("[data-cancel-res]")
      .forEach(function (btn) {
        btn.addEventListener("click", async function () {
          try {
            var reservaId = btn.dataset.cancelRes;

            await apiRequest(
              "/reservas/" + reservaId + "/",
              {
                method: "PATCH",
                body: JSON.stringify({
                  status: "cancelada"
                })
              }
            );

            toast("Reserva cancelada.");

            await carregarDadosAPI();

            refreshCurrentView();
          } catch (error) {
            toast(error.message);
          }
        });
      });
  }

  function renderReadersTable() {
    var tbody = document.getElementById("readersTable");

    if (store.readers.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5">' +
        '<div class="empty-state">' +
        '<div class="icon">👤</div>' +
        "Nenhum leitor cadastrado." +
        "</div>" +
        "</td></tr>";

      return;
    }

    tbody.innerHTML = store.readers
      .map(function (r) {
        var active = store.loans.filter(function (l) {
          return l.readerId === r.id && !l.returnDate;
        }).length;

        return (
          "<tr>" +
          "<td>" +
          r.name +
          "</td>" +
          "<td>" +
          r.type +
          "</td>" +
          "<td>" +
          (r.email || "—") +
          (r.phone ? " · " + r.phone : "") +
          "</td>" +
          "<td>" +
          fmtDate(r.since) +
          "</td>" +
          "<td>" +
          active +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  document
    .getElementById("btnAddBook")
    .addEventListener("click", async function () {
      var title = document
        .getElementById("newBookTitle")
        .value.trim();

      var author = document
        .getElementById("newBookAuthor")
        .value.trim();

      var category =
        document
          .getElementById("newBookCategory")
          .value.trim() || "Geral";

      var copies = parseInt(
        document
          .getElementById("newBookCopies")
          .value.trim(),
        10
      );

      if (!title || !author) {
        toast("Informe título e autor.");
        return;
      }

      if (!copies || copies < 1) {
        copies = 1;
      }

      try {
        /*
          O modelo atual exige ISBN.
          Como o formulário não possui campo de ISBN,
          geramos um identificador numérico de 13 dígitos.
        */
        var isbn = String(Date.now()).slice(-13);

        await cadastrarLivroAPI({
          titulo: title,
          autor: author,
          categoria: category,
          isbn: isbn,
          quantidade_total: copies,
          quantidade_disponivel: copies
        });

        toast(
          'Título "' +
            title +
            '" adicionado ao acervo.'
        );

        document.getElementById(
          "newBookTitle"
        ).value = "";

        document.getElementById(
          "newBookAuthor"
        ).value = "";

        document.getElementById(
          "newBookCategory"
        ).value = "";

        document.getElementById(
          "newBookCopies"
        ).value = "";

        await carregarDadosAPI();

        renderCategoryFilter();
        renderAcervoTable();
      } catch (error) {
        toast(error.message);
      }
    });

  function renderAcervoTable() {
    var tbody = document.getElementById("acervoTable");

    if (store.books.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6">' +
        '<div class="empty-state">' +
        '<div class="icon">📚</div>' +
        "Nenhum livro cadastrado no acervo." +
        "</div>" +
        "</td></tr>";

      return;
    }

    tbody.innerHTML = store.books
      .slice()
      .sort(function (a, b) {
        return a.title.localeCompare(b.title, "pt-BR");
      })
      .map(function (b) {
        return (
          "<tr>" +
          "<td>" +
          b.title +
          "</td>" +
          "<td>" +
          b.author +
          "</td>" +
          "<td>" +
          b.category +
          "</td>" +
          "<td>" +
          b.copies +
          "</td>" +
          "<td>" +
          availableCopies(b) +
          "</td>" +
          "<td>" +
          b.timesLoaned +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function openModal(id) {
    var modal = document.getElementById(id);

    if (modal) {
      modal.classList.add("active");
    }
  }

  function closeModal(id) {
    var modal = document.getElementById(id);

    if (modal) {
      modal.classList.remove("active");
    }
  }

  document
    .querySelectorAll("[data-close]")
    .forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeModal(btn.dataset.close);
      });
    });

  document
    .querySelectorAll(".modal-overlay")
    .forEach(function (ov) {
      ov.addEventListener("click", function (e) {
        if (e.target === ov) {
          ov.classList.remove("active");
        }
      });
    });

  function renderAllForView(viewId) {
    renderNotices();

    if (viewId === "catalogo") {
      renderCategoryFilter();
      renderCatalogo();
    }

    if (viewId === "conta") {
      renderReaderSelect();
      renderConta();
    }

    if (viewId === "painel") {
      renderPainel();
    }

    if (viewId === "emprestimos") {
      renderLoansTable();
    }

    if (viewId === "reservas-staff") {
      renderReservationsTable();
    }

    if (viewId === "leitores") {
      renderReadersTable();
    }

    if (viewId === "acervo") {
      renderCategoryFilter();
      renderAcervoTable();
    }
  }

  function refreshCurrentView() {
    renderAllForView(currentView);
  }

  document
    .getElementById("searchInput")
    .addEventListener("input", renderCatalogo);

  document
    .getElementById("categoryFilter")
    .addEventListener("change", renderCatalogo);

  document
    .getElementById("availFilter")
    .addEventListener("change", renderCatalogo);

  async function iniciarSistema() {
    await carregarDadosAPI();

    currentReaderId =
      store.readers[0]
        ? store.readers[0].id
        : null;

    renderTabs();

    setView("catalogo");
  }

  iniciarSistema();
})();