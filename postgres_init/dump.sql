--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    hashed_password character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vacancies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vacancies (
    id integer NOT NULL,
    title character varying,
    company_name character varying,
    address character varying,
    logo_url character varying,
    description character varying,
    created_at timestamp without time zone,
    status character varying
);


ALTER TABLE public.vacancies OWNER TO postgres;

--
-- Name: vacancies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vacancies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vacancies_id_seq OWNER TO postgres;

--
-- Name: vacancies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vacancies_id_seq OWNED BY public.vacancies.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vacancies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacancies ALTER COLUMN id SET DEFAULT nextval('public.vacancies_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, hashed_password) FROM stdin;
1	admin	$2b$12$M5I4n.iBvK24Yx5IhjujROL5rOArTmD85ztvu/kHev4kSLRKulcFy
\.


--
-- Data for Name: vacancies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vacancies (id, title, company_name, address, logo_url, description, created_at, status) FROM stdin;
118713087	FullStack Typescript разработчик	Онлайн-школа Emi	\N	https://img.hhcdn.ru/employer-logo-original/924465.png	<p>Привет. Мы в поисках крутых программистов в команду. </p> <p> </p> <p><strong>О нас: </strong></p> <p>- С 2021 года разрабатываем IT сервисы для бьюти рынка</p> <p>- Резиденты сколково и минцифры</p> <p>- Используем Solid framework внутри среды для разработки Chatium</p> <p>Ищем в команду 3х программистов, которые реализуют ряд сервисов для наших клиентов (бьюти мастера и конечные физ лица) </p> <p>LMS, онлайн запись, онлайн ежедневник, e-com магазин косметики, CRM система, Социальная сеть и другие разные сервисы для девочек. </p> <p> </p> <p><strong>Что мы предлагаем: </strong></p> <ul> <li>Трудоустройство по ТК с еженедельной оплатой</li> <li>Свободный график работы и работой удаленно</li> <li>Интересные проекты без душной и неповоротливой бюрократии</li> <li>Фиксированная оплата + премии за реализацию проектов</li> </ul> <p> </p> <p><strong>Обязанности:</strong></p> <p>- Разработка логики и интерфейсов мобильных и веб приложений в соответствии с дизайн макетами</p> <p>- Работа с базой данных через ORM, без SQL диалекта</p> <p>- Коммуникация с командой</p> <p> </p> <p><strong>Требования:</strong></p> <p>- Опыт разработки на Typescript от 1 года</p> <p>- Знание Typescript, нативного Javascript, ES6/7</p> <p>- Отличное знания CSS + адаптивная верстка</p> <p>- Опыт работы c RESTful API</p> <p>- Понимание роутинга и работы HTTP протокола в целом</p> <p>- Умение работать с чужим кодом</p> <p>- Умение оценивать сроки реализации и объём работы</p> <p>- Опыт работа с Figma или подобным ПО</p> <p> </p> <p> </p> <p> </p>	2025-03-24 13:11:16	Открытая
118265939	Fullstack-разработчик	Центр нормативно-технической документации	\N	https://img.hhcdn.ru/employer-logo-original/813665.png	<strong>Обязанности:</strong> <ul> <li>Интеграция системы с программными продуктами третьих фирм;</li> <li>Взаимодействие с сотрудниками компании по постановке задач, их формализация.</li> </ul> <strong>Требования:</strong> <ul> <li>Знание и опыт работы с языком программирования: Node JS</li> <li>Навыки работы с языком разметки: HTML, CSS</li> <li>Знание и опыт работы с СУБД: MySQL, PostgreSQL</li> <li>Приветствуется опыт работы с библиотекой React</li> </ul> <strong>Условия:</strong> <ul> <li>Интересные и нестандартные задачи и проекты;</li> <li>Активный и вовлеченный в бизнес-процессы собственник;</li> <li>Официальное трудоустройство по ТК РФ;</li> <li>График работы: удаленный/ офисный/гибрид/удаленный (по желанию в г. Санкт-Петербург, Калининград)</li> <li>Стабильный доход;</li> <li>Заработная плата: 100 тыс. (оклад) + премия (50 тыс. по результатам работы за месяц. Работа строится спринтами).</li> <li>Испытательный срок 3 мес. На испытательном сроке 60 тыс. (оклад) + премия (40 тыс. по результатам работы за месяц).</li> <li> <p>Важно! 1 этап - предлагаем пройти тестовое задание, по результатам которого приглашаем на 2 этап - онлайн собеседование. </p> </li> <li><strong><em>Наша компания входит в реестр аккредитованных ИТ-компаний;</em></strong></li> <li>Сплочённая дружная команда, готовая поделиться знаниями и опытом (80% сотрудников работают в компании более 5 лет).</li> <li>Выездные семинары, тренинги, обучение за счет компании.</li> </ul>	2025-03-24 21:35:19	Открытая
117908264	Junior Backend Developer	Pandaverse OÜ	\N	https://img.hhcdn.ru/employer-logo-original/1309829.png	<p><em>Мы — <strong>Pandaverse OÜ</strong>, компания, специализирующаяся на разработке программного обеспечения в сферах <strong>AI &amp; ML</strong>, <strong>Blockchain</strong> и <strong>SaaS</strong>. Мы применяем передовые технологии для упрощения сложных задач и создания продуктов, которые отвечают требованиям бизнеса и пользователей.</em></p> <p><em><strong>Наша миссия</strong> — разрабатывать интуитивно понятные и высокоэффективные инструменты, помогающие пользователям экономить время и решать задачи максимально эффективно.</em></p> <p>В рамках нашей экосистемы мы развиваем новый продукт <strong>AmigoChat</strong> — <strong>AI ассистент</strong> для работы с текстом, музыкой и картинками, включающий разные модели в одной подписке.<br />Мы ищем backend специалиста, который возьмёт на себя процесс разработки серверной части телеграм-бота.</p> <p><strong>Задачи, которые вас ждут:</strong></p> <ul> <li> <p>Разработка и поддержка серверной части телеграм-бота на NestJS, PostgreSQL;</p> </li> <li> <p>Создание и оптимизация баз данных, взаимодействие с ними через ORM или собственные запросы;</p> </li> <li> <p>Реализация бизнес-логики и алгоритмов телеграм-бота;</p> </li> <li> <p>Интеграция с внешними сервисами и API, такими как платежные протоколы и прочее;</p> </li> <li> <p>Обеспечение безопасности телеграм-бота, включая защиту от уязвимостей и атак;</p> </li> <li> <p>Документирование кода и архитектуры приложения для удобства сопровождения и дальнейшей разработки;</p> </li> <li>Участие в планировании и обсуждении новых функциональных требований и архитектурных решений.</li> </ul> <strong>Требования:</strong> <ul> <li> <p>Наличие коммерческого опыта в разработке Backend на NestJS, PostgreSQL от 1 года;</p> </li> <li> <p>Практический опыт разработки Telegram-ботов, включая написание бизнес-логики с использованием Telegram Bot API;</p> </li> <li> <p>Знание сетевых протоколов, модели OSI, принципов клиент-серверного взаимодействия и работы RESTful API;</p> </li> <li> <p>Знание и уверенное владение TypeScript;</p> </li> <li> <p>Опыт работы с Yarn;</p> </li> <li> <p>Опыт работы создания микросервисных приложений и контейнеров Docker;</p> </li> <li> <p>Опыт интеграции со сторонними сервисами;</p> </li> <li> <p>Гибкость и умение находить нестандартные пути для решения задач; </p> </li> <li> <p>Отличные коммуникативные навыки, умение работать в команде;</p> </li> <li> <p>Отличное понимание алгоритмов, структур данных, паттернов проектирования и принципов программирования (SOLID, DRY, KISS).</p> </li> </ul> <strong>Что мы предлагаем:</strong> <ul> <li>Гибкий старт рабочего дня, <strong>офисный формат работы(Санкт-Петербург, Москва, Тбилиси);</strong></li> <li>Оформление в качестве самозанятого или индивидуального предпринимателя (с компенсацией налогов). Выплаты в криптовалюте или на рублевый счет;</li> <li><strong>28 календарных дней</strong> оплачиваемого отпуска и 100% оплата больничных;</li> <li>компенсацию расходов на курсы, семинары и специализированную литературу;</li> <li>составление индивидуального плана развития после прохождения испытательного срока.</li> <li> <p><strong>Важно:</strong> мы не следуем производственному календарю РФ. Вместо этого вы получите <strong>7 дополнительных праздничных дней</strong> в году, которые можно использовать в любое время по предварительному согласованию с руководителем.</p> </li> </ul>	2025-03-24 16:32:17	Открытая
118195411	Инженер-программист (Группа цифровой трансформации и автоматизации бизнес-процессов)	ТрансМашХолдинг, Группа компаний	Санкт-Петербург, Петроградская набережная, 34А	https://img.hhcdn.ru/employer-logo-original/671357.png	<p>Мы - молодая команда в крупной компании перед которой стоят амбициозные задачи. Прежде всего наш отдел занимается цифровой трансформацией предприятия, создает аналитические дашборды и придумывает способы автоматизации расчетов. В настоящее время у нас идет разработка web-приложения, которое будет объединять в себе аналитику, хранение и обработку данных, автоматизацию и многое другое.</p> <p>Тебе подойдет эта работа, если ты ответственный, не боишься широкого спектра задач и нестандартных подходов.</p> <p><strong>Стек технологий:</strong></p> <p>1. Python (Django);</p> <p>2. Знание HTML/CSS ;</p> <p>4. Опыт работы с Git (GitLab);</p> <p>5. Опыт работы с Docker (Compose);</p> <p>6. Опыт работы с PostgreSQL;</p> <p>7. Знание операционных систем Unix/Linux/Debian;</p> <p>8. Nginx;</p> <p>9. Опыт разработки микросервисной архитектуры.</p> <p><strong>Необходимый опыт и знания:</strong></p> <p>- опыт разработки проектов на Django с нуля, от планирования – до реализации;</p> <p>- опыт работы с Django, PostgreSQL, REST API, Web-socket, Git, Docker;</p> <p>- открытость к новым знаниям и умение совершенствовать свои умения и навыки.</p> <p><strong>Что нужно будет реализовывать:</strong></p> <p>1. Участие в разработке архитектуры приложения и проектировании БД;</p> <p>2. Разработка backend для веб-приложения;</p> <p>3. Написание кода расчетной части программы;</p> <p>4. Разработка сервисов логирования, кэширования, LDAP;</p> <p>5. Участие в планировании и оценке задач;</p> <p>6. Проведение тестирования внутренних продуктов.</p> <p><strong>Условия:</strong></p> <ul> <li>оформление согласно ТК РФ;</li> <li>оклад, ежеквартальные премии;</li> <li>возможность решения интересных, нестандартных задач;</li> <li>возможность профессионального и карьерного развития;</li> <li>удобная локация офиса;</li> <li>дружный энергичный коллектив;</li> <li>активная корпоративная жизнь.</li> </ul>	2025-03-25 09:12:36	Открытая
96412076	Программист С++/Qt	НПО Колибри	Санкт-Петербург, Дибуновская улица, 50	https://img.hhcdn.ru/employer-logo-original/836908.png	<p>Компания ООО «НПО Колибри» занимается разработкой аппаратно-программных решений в сфере телекоммуникаций (сотовая связь, Wi-Fi сети, UHF передача данных).</p> <p>В наш дружный коллектив мы ищем начинающего энергичного специалиста, для построения PoC(proof of concept) моделей на языках C++\\asm.</p> <p><strong>Обязанности:</strong></p> <ul> <li>Разработка решений в области сетевых протоколов передачи данных;</li> <li>Разработка библиотек взаимодействия с устройствами подключаемыми по USB, mini PCIe, COM Port;</li> <li> <p>Анализ сетевого трафика, генерируемого;</p> </li> <li> <p>Документирование исходного кода, методик, исследований;</p> </li> </ul> <p><strong>Требования:</strong></p> <ul> <li>Опыт написания / отладки программного кода C++/Qt ;</li> <li>Понимание основных принципов ООП и шаблонов проектирования;</li> <li>Знание bash/python;</li> <li>Желание и готовность изучать новые технологии и инструменты разработки;</li> </ul> <p><strong>Плюсами будет:</strong></p> <ul> <li>Знание базовых AT команд GSM/UMTS/LTE модемов;</li> <li>Знание технологий и стандартов IEEE 802.11, Bluetooth;</li> <li>Опыт проведения реверса чужого программного кода;</li> <li>Опыт исследования сетей передачи данных;</li> </ul> <p><strong>Условия:</strong></p> <ul> <li>Работа в профессиональном и увлеченном коллективе;</li> <li>Официальное оформление с полным соблюдением ТК РФ (полностью &quot;белая&quot; заработная плата);</li> <li>Стабильные выплаты заработной платы 2 раза в месяц;</li> <li>График работы с понедельника по пятницу с возможностью выбора с 9:00 до 18:00, с 10:00 до 19:00 с часом на обед;</li> <li>Работа в собственном офисе рядом с ст. м. Старая деревня;</li> <li>Возможности профессионального роста и развития;</li> </ul>	2025-03-24 17:36:21	Открытая
118075201	Junior QA automation engineer (Python)	Nexign (АО Нэксайн)	\N	https://img.hhcdn.ru/employer-logo-original/522864.png	<p><strong>о проекте</strong></p> <p>Приглашаем в команду NWM NMS (Network Management System) специалиста для участия в обеспечении качества продукта.</p> <p>NMS – это система, которая работает в ядре сети оператора связи и управляет сетевыми функциями лаборатории NWM, такими как DRA, PCRF и др. NMS реализует функциональность FCAPS (Fault-management, Configuration, Accounting, Performance, Security) и управление жизненным циклом LCM (Life Cycle Management) сетевых функций.</p> <p><strong>о задачах</strong></p> <ul> <li>составление планов тестирования, определение объемов тестирования</li> <li>реализация и поддержка автоматизированных тестовых сценариев</li> <li>выполнение тестирования и анализ результатов</li> </ul> <p><strong>о тебе</strong></p> <ul> <li>опыт программирования на Python</li> <li>знакомство с PyTest или готовность к изучению в сжатые сроки</li> <li>опыт работы с ОС Linux </li> <li>опыт работы с системами контроля версий (Git)</li> </ul> <p><strong>будет плюсом</strong></p> <ul> <li>опыт применения CI/CD практик и инструментов (Jenkins)</li> <li>понимание необходимости и методов оценки тестового покрытия</li> <li>знакомство с Docker, Docker Compose, Kubernetes</li> <li>знакомство с сетевыми протоколами (HTTP/HTTPS, REST, DIAMETER)</li> <li>понимание работы сетевого стека и принципов сетевой безопасности</li> <li>опыт работы с DB PostgreSQL</li> <li>опыт работы с 3gpp и ETSI спецификациями</li> </ul>	2025-03-25 08:59:00	Открытая
118573802	Разработчик (без опыта)	Рекруто	Санкт-Петербург, набережная Обводного канала, 21	https://img.hhcdn.ru/employer-logo-original/1131816.png	<p><strong>Python был, есть и будет, и у вас появилась реальная возможность прокачать свои скиллы в этом замечательном высокоуровневом языке на реальных коммерческих проектах.</strong></p> <p>Помимо чистого Питона вы столкнётесь и освоите множество полезных фреймворков, сервисов, технологий и подходов, в том числе: Джанго, Фласк, Эластик, Селари, Рэббит, Нджингс, Кубернетес, Докер, Постгрес, Вэбсокет, Монго, Рэдис, Эспэа, Бэм, Бутстрап и т.д.</p> <p>Фронтовые задачи тоже будут иметь место, но в основном с джанговым отливом. У нас есть своя библиотека компонентов.</p> <p>Рекруто – стартап в сфере подбора персонала. Наше преимущество перед корпоратом состоит в том, что мы не корпорат.</p> <p>В планах создать пару веб-сервисов, в том числе для сферы рекрутмента.</p> <p>Для этого мы ищем начинающего, сообразительного, шустрого, амбициозного интерна-джуна питониста.</p> <p>Опыт в коммерческой разработке не требуется – важнее навык быстро обучаться, не бояться задач, не тупить, быть инициативным и при этом исполнительным. А самое важное – проблем солвинг.</p> <p><strong>Чем предстоит заниматься?</strong></p> <ul> <li>Писать тесты</li> <li>Писать фичи</li> <li>Подключать АПи</li> <li>Писать фронт</li> <li>Диплоить проекты</li> </ul> <p><strong>Кого мы ищем?</strong></p> <p>Мы ищем человека, который не боится незнакомых задач и настроен на долгосрочное сотрудничество.</p> <p>Можно работать частично удалённо и в свободном графике. Некотоые наши коллеги успешно совмешают работу с учёбой.</p> <p><strong>Наш девиз: Кто хочет — ищет способ, кто не хочет — причину.</strong></p> <p> </p> <p><em>Вы, наверное, обратили внимание, что у нашей вакансии 2, 3, 4, и тд тысяч откликов. И это могло вас смутить.</em></p> <p><em>Не загоняйтесь,</em></p> <p><em>А смело откликайтесь —</em></p> <p><em>Мы смотрим всех в обед</em></p> <p><em>И всем даём ответ ;)</em></p>	2025-03-19 19:57:59	Открытая
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: vacancies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vacancies_id_seq', 1, false);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vacancies vacancies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacancies
    ADD CONSTRAINT vacancies_pkey PRIMARY KEY (id);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: ix_vacancies_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_vacancies_id ON public.vacancies USING btree (id);


--
-- Name: ix_vacancies_title; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_vacancies_title ON public.vacancies USING btree (title);


--
-- PostgreSQL database dump complete
--

