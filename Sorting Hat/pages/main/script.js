document
  .getElementById("examForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Отменяем стандартное поведение формы

    // Получаем значения из формы
    const math = parseInt(document.getElementById("math").value);
    const russian = parseInt(document.getElementById("russian").value);
    const informatics = parseInt(document.getElementById("informatics").value);
    const physics = parseInt(document.getElementById("physics").value);

    // Минимальные баллы
    const minScores = {
      math: 40,
      russian: 40,
      informatics: 44,
      physics: 39,
    };

    // Проверка на минимальные значения
    if (
      math < minScores.math ||
      russian < minScores.russian ||
      (informatics < minScores.informatics && physics < minScores.physics)
    ) {
      document.getElementById("lack").innerText =
        "Ваших баллов недостаточно для поступления :(";
      return;
    }

    // Вычисление суммы баллов
    const totalScore = math + russian + Math.max(informatics, physics);

    // Загрузка JSON данных
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        let availableDirections = [];
        let budgetMax = -1;
        let paidMax = -1;

        // Сравнение с проходными баллами
        data.forEach((item) => {
          if (totalScore >= item["проходной_балл"].бюджет) {
            availableDirections.push(item);
            budgetMax = Math.max(budgetMax, item["проходной_балл"].бюджет);
          }
        });

        if (availableDirections.length < 1) {
          data.forEach((item) => {
            if (totalScore >= item["проходной_балл"].платное) {
              availableDirections.push(item);
              paidMax = Math.max(paidMax, item["проходной_балл"].платное);
            }
          });
        }

        // Проверка доступных направлений
        if (availableDirections.length < 1) {
         document.getElementById("lack").innerText =
            "Нет направлений, доступных вам :(";
        } else {
          // Спрятать форму с баллами
          this.style.display = "none";
          // Показать блок с тестом
          document.getElementById("test-container").style.display = "block";
          // Список направлений (12 штук)
          const testDirections = [
            { наименование: "Прикладная математика", код: "pm" },
            {
              наименование: "Информатика и вычислительная техника",
              код: "ivt",
            },
            { наименование: "Информационные системы и технологии", код: "ist" },
            {
              наименование:
                "Информационные системы и технологии. Разработка компьютерных игр и приложений",
              код: "ist_games",
            },
            { наименование: "Прикладная информатика", код: "pi" },
            { наименование: "Программная инженерия", код: "pe" },
            { наименование: "Информационная безопасность", код: "ib" },
            { наименование: "Компьютерная безопасность", код: "kb" },
            {
              наименование:
                "Информационная безопасность автоматизированных систем",
              код: "ibas",
            },
            {
              наименование:
                "Автоматизация технологических процессов и производств",
              код: "atpp",
            },
            { наименование: "Системный анализ и управление", код: "sau" },
            { наименование: "Управление в технических системах", код: "uts" },
          ];

          // Вопросы с вариантами и начисляемыми очками
          const questions = [
            {
              text: "Как вы относитесь к математике?",
              answers: [
                {
                  text: "Обожаю решать сложные задачи, строить модели.",
                  points: { pm: 5, sau: 2 },
                },
                {
                  text: "Нравится, но предпочитаю прикладные аспекты.",
                  points: { ist: 1, pi: 2, ivt: 2, uts: 3 },
                },
                {
                  text: "Предпочитаю написать программу, которая будет считать за меня",
                  points: { pe: 2, sau: 2, atpp: 3, ivt: 1 },
                },
                {
                  text: "Не люблю, избегаю.",
                  points: { ist_games: 1, pi: 1 },
                },
              ],
            },
            {
              text: "Ваше отношение к программированию:",
              answers: [
                {
                  text: "Писал(а) код в школе/до сих пор пишу",
                  points: { ivt: 1, pe: 1 },
                },
                {
                  text: "Знаю основы, хочу углубленно изучать",
                  points: { ist: 1, pi: 1 },
                },
                {
                  text: "Интересно, но только для решения конкретных задач.",
                  points: { pm: 3 },
                },
                {
                  text: "Не нравится.",
                  points: {},
                },
              ],
            },
            {
                text: "Если бы вы были разработчиком приложений, то какие бы приложения создавали?",
                answers: [
                  {
                    text: "Игры, развлекательные приложения.",
                    points: { pi: 2, ist_games: 3 },
                  },
                  {
                    text: "Системное ПО.",
                    points: { ist: 2, pe: 3 },
                  },
                  {
                    text: "Для работы оборудования на производстве.",
                    points: { ivt: 1, atpp: 3, uts: 2 },
                  },
                  {
                    text: "По защите пользователей.",
                    points: { ib: 2, kb: 2, ibas: 3 },
                  },
                  {
                    text: "По работе с большими данными.",
                    points: { sau: 2 },
                  },
                ],
              },
              {
                text: "Как вы относитесь к задачам безопасности информации?",
                answers: [
                  {
                    text: "Хочу стать разработчиком в области защиты информации.",
                    points: { kb: 3 },
                  },
                  {
                    text: "Мне бы подошло искать утечки информации.",
                    points: { ib: 3 },
                  },
                  {
                    text: "Меня больше привлекает моделирование и исследование защищённых автоматизированных систем.",
                    points: { ibas: 3 },
                  },
                  {
                    text: "Не нравится / хочу другое.",
                    points: {},
                  },
                ],
              },
              {
                text: "Хотели бы вы управлять IT-проектами?",
                answers: [
                  {
                    text: "Да, мечтаю стать руководителем.",
                    points: { ist: 2, sau: 2 },
                  },
                  {
                    text: "Да, но только если это связано с технической частью.",
                    points: { pe: 3 },
                  },
                  {
                    text: "Нет, предпочитаю индивидуальную работу.",
                    points: {},
                  },
                ],
              },
              {
                text: "Какая сфера вам ближе?",
                answers: [
                  {
                    text: "Наука, исследования, аналитика.",
                    points: { pm: 2, sau: 2 },
                  },
                  {
                    text: "IT-разработка, стартапы.",
                    points: { ivt: 1, ist: 2 },
                  },
                  {
                    text: "Промышленность, автоматизация.",
                    points: { atpp: 3, uts: 2 },
                  },
                  {
                    text: "Государственные структуры, безопасность.",
                    points: { ibas: 2, ib: 2 },
                  },
                ],
              },
              {
                text: "Где вы видите себя через 5 лет?",
                answers: [
                  {
                    text: "Data Scientist в крупной компании.",
                    points: { pm: 3, sau: 2, ivt: 1, ibas: 2 },
                  },
                  {
                    text: "Веб- или мобильный разработчик.",
                    points: { ivt: 2, ist: 1, pi: 3, pe: 2 },
                  },
                  {
                    text: "Специалист по кибербезопасности.",
                    points: { ibas: 3, ib: 2, ibas2: 1 }, // ibas2 для "Информационная безопасность" (если нужно уточнить)
                  },
                  {
                    text: "Инженер на производстве.",
                    points: { atpp: 3, uts: 3, pe: 1 },
                  },
                ],
              },
              {
                text: "Какой вид деятельности вам интересен?",
                answers: [
                  {
                    text: "Анализ данных и математическое моделирование",
                    points: { pm: 3, sau: 2 },
                  },
                  {
                    text: "Программирование и разработка ПО",
                    points: { pe: 3, ivt: 2, pi: 2 },
                  },
                  {
                    text: "Проектирование и управление IT-системами",
                    points: { ist: 3, pi: 2 },
                  },
                  {
                    text: "Разработка игр и мультимедийных приложений",
                    points: { istgk: 3, pi: 2 }, // istgk — "Информационные системы и технологии. Разработка игр"
                  },
                  {
                    text: "Защита информации и кибербезопасность",
                    points: { ibas: 3, ib: 2 },
                  },
                  {
                    text: "Автоматизация производственных процессов",
                    points: { atpp: 3, uts: 2 },
                  },
                ],
              },
              {
                text: "Какой язык программирования вам ближе?",
                answers: [
                  {
                    text: "Python",
                    points: { pm: 2, sau: 1 },
                  },
                  {
                    text: "C# или Java",
                    points: { pi: 1, pe: 2 },
                  },
                  {
                    text: "JavaScript",
                    points: { pi: 2, pe: 1 },
                  },
                  {
                    text: "C++",
                    points: { istgk: 3, ist: 2, ivt: 2 },
                  },
                  {
                    text: "Другие",
                    points: { ivt: 2, atpp: 1 },
                  },
                  {
                    text: "Не интересуюсь программированием",
                    points: { uts: 2, ibas: 1 },
                  },
                ],
              },
              {
                text: "Что вас больше привлекает?",
                answers: [
                  {
                    text: "Работа с большими данными и машинным обучением",
                    points: { pm: 3, sau: 2 },
                  },
                  {
                    text: "Создание веб-приложений и интерфейсов",
                    points: { ist: 3, pi: 2 },
                  },
                  {
                    text: "Разработка мобильных приложений",
                    points: { pi: 3, pe: 2 },
                  },
                  {
                    text: "3D-моделирование и анимация",
                    points: { istgk: 3, ist: 2 },
                  },
                  {
                    text: "Криптография и защита сетей",
                    points: { ib: 3, ibas: 2 },
                  },
                  {
                    text: "Управление производственными системами",
                    points: { atpp: 3, uts: 2 },
                  },
                ],
              },
              {
                text: "Какой формат работы вам ближе?",
                answers: [
                  {
                    text: "Научные исследования и аналитика",
                    points: { pm: 2, sau: 1 },
                  },
                  {
                    text: "Командная разработка проектов",
                    points: { pe: 2, ist: 1 },
                  },
                  {
                    text: "Работа с аппаратным обеспечением",
                    points: { ivt: 2, atpp: 1 },
                  },
                  {
                    text: "Творческая деятельность (дизайн, гейм-дизайн)",
                    points: { istgk: 2, pi: 1 },
                  },
                  {
                    text: "Администрирование и безопасность",
                    points: { ibas: 2, ib: 1 },
                  },
                ],
              },
              {
                text: "Какие школьные предметы вам нравятся?",
                answers: [
                  {
                    text: "Математика и физика",
                    points: { pm: 2, ivt: 1 },
                  },
                  {
                    text: "Информатика",
                    points: { pe: 2, pi: 1 },
                  },
                  {
                    text: "Черчение и инженерные дисциплины",
                    points: { atpp: 2, uts: 1 },
                  },
                  {
                    text: "Гуманитарные предметы",
                    points: { istgk: 2, ist: 1 },
                  },
                  {
                    text: "Химия и биология",
                    points: { sau: 2, ibas: 1 },
                  },
                ],
              },
              {
                text: "Какой проект вы бы хотели реализовать?",
                answers: [
                  {
                    text: "Систему анализа данных для бизнеса",
                    points: { pm: 3, sau: 2 },
                  },
                  {
                    text: "Мобильное приложение или веб-сервис",
                    points: { pi: 3, pe: 2 },
                  },
                  {
                    text: "Компьютерную игру или мультимедийный контент",
                    points: { istgk: 3, pi: 2 },
                  },
                  {
                    text: "Защищённую сетевую инфраструктуру",
                    points: { ib: 3, ibas: 2 },
                  },
                  {
                    text: "Автоматизированную производственную линию",
                    points: { atpp: 3, uts: 2 },
                  },
                ],
              },
              {
                text: "Какой уровень ответственности вас привлекает?",
                answers: [
                  {
                    text: "Работа с конфиденциальными данными",
                    points: { ibas: 2, ib: 1 },
                  },
                  {
                    text: "Управление IT-проектами",
                    points: { pe: 2, ist: 1 },
                  },
                  {
                    text: "Разработка критически важных систем (например, для космоса)",
                    points: { ivt: 2, atpp: 1 },
                  },
                  {
                    text: "Творческая свобода и эксперименты",
                    points: { istgk: 2, pi: 1 },
                  },
                ],
              }
          ];
          
          let currentQuestionIndex = 0;
          const scores = {};
          testDirections.forEach((dir) => (scores[dir.код] = 0));

          const questionEl = document.getElementById("question");
          const answersEl = document.getElementById("answers");
          const testContainer = document.getElementById("test-container");
          const resultContainer = document.getElementById("result");
          const resultText = document.getElementById("result-text");

          function showQuestion() {
            const q = questions[currentQuestionIndex];
            questionEl.textContent = q.text;
            answersEl.innerHTML = "";

            q.answers.forEach((answer) => {
              const btn = document.createElement("button");
              btn.textContent = answer.text;
              btn.onclick = () => {
                for (const [dirCode, pts] of Object.entries(answer.points)) {
                  if (scores.hasOwnProperty(dirCode)) {
                    scores[dirCode] += pts;
                  }
                }
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                  showQuestion();
                } else {
                  showResult();
                }
              };
              answersEl.appendChild(btn);
            });
          }

          function showResult() {
            testContainer.style.display = "none";
            resultContainer.style.display = "block";

            const sortedDirections = [...testDirections].sort(
              (a, b) => scores[b.код] - scores[a.код]
            );

            const paySource =
              budgetMax >= paidMax
                ? "(на бюджетной основе)"
                : "(на платной основе)";

            outer: for (const dir of sortedDirections) {
              for (const item of availableDirections) {
                if (dir.наименование === item.наименование) {
                  resultText.innerText = `${item.код} ${item.наименование} ${paySource}`;
                  break outer;
                }
              }
            }
          }

          showQuestion();
        }
      })
      .catch((error) => console.error("Ошибка загрузки данных:", error));
  });
