export default {
  locale: {
    ru: 'Русский',
    en: 'English',
  },
  signin: {
    title: 'Войдите',
    alternate: {
      text: 'Нет аккаунта?',
      btn: 'Зарегистрируйтесь',
    },
  },
  signup: {
    title: 'Зарегистрируйтесь',
    currency: 'Основная валюта',
    alternate: {
      text: 'Уже есть аккаунт?',
      btn: 'Войдите',
    },
  },
  form: {
    email: {
      label: 'Email',
    },
    username: {
      label: 'Имя пользователя',
    },
    password: {
      label: 'Пароль',
    },
    firstName: {
      label: 'Имя',
    },
    lastName: {
      label: 'Фамилия',
    },
    middleName: {
      label: 'Отчество',
    },
    dateFrom: {
      label: 'Дата с',
      prefix: 'С',
    },
    dateTo: {
      label: 'Дата по',
      prefix: 'По',
    },
    comment: {
      label: 'Заметка',
    },
    worldName: {
      label: 'Название мира',
      error: {
        required: 'Название мира обязатедльно',
        patternMismatch: 'Используйте только латинские буквы, цифры и символы -_',
        notUnique: 'Мир {msg} уже существует. Название мира должно быть уникально для этого сервера и игры',
        restricted: 'Пожалуйста, не используйте "{msg}" как название мира',
      },
    },
  },
  btn: {
    submit: 'Отправить',
    ok: 'OK',
    save: 'Сохранить',
    cancel: 'Отменить',
    reset: 'Очистить',
    edit: 'Редактировать',
    signout: 'Выйти',
    create: 'Создать',
    createOne: 'Создать {msg}',
    add: 'Добавить',
    delete: 'Удалить',
    deleteOne: 'Удалить {msg}',
    addOne: 'Добавить {msg}',
    restore: 'Восстановить',
    download: 'Скачать',
    upload: 'Загрузить',
    play: 'Играть',
    stop: 'Остановить',
    comment: 'Заметка',
    install: 'Установить',
  },
  error: {
    unknown: {
      title: 'Что-то пошло не так!',
      message: 'Пожалуйста, попробуйте позже'
    },
    unrated: {
      title: 'Найдены записи о работе без ставки!',
    },
  },
  empty: '{msg} не найдено',
  app: {
    title: 'Oh my Deddic',
    titleMobile: 'Oh my Deddic',
  },
  page: {
    home: 'Домой',
    servers: 'Сервера',
  },
  servers: {
    loading: 'Загружаем список серверов...',
    server: 'Сервер',
    add: {
      title: 'Добавить сервер',
      name: {
        label: 'Название',
      },
      ipAddress: {
        label: 'IP адрес',
      },
      port: {
        label: 'Порт',
      },
      provider: {
        label: 'Выберите провайдера',
      },
      os: {
        label: 'Выберите ОС',
      },
      config: {
        label: 'Заполните учетные данные провайдера и операционной системы',
        required: 'Поле обязательно для заполнения',
      },
      success: {
        title: 'Сервер {msg} успешно добавлен'
      },
    },
    edit: {
      tooltip: 'Редактировать',
      title: 'Редактировать данные сервера',
      success: {
        title: 'Сервер {msg} успешно изменен'
      },
    },
    delete: {
      tooltip: 'Удалить',
      title: 'Вы уверены?',
      text: 'Это действие удаляет сервер из системы. У провайдера сервер не удалится. Продолжить?',
      success: 'УДАЛЕНО. Не забудьте удалить сервер у провайдера',
    },
    features: {
      cpu: 'CPU',
      ram: 'RAM',
      disc: 'Disc',
      datacenter: 'Дата-центр',
      billing: 'Оплата',
      hourly: 'Почасовая',
      monthly: 'Помесячная',
    },
    status: {
      on: 'Включить',
      off: 'Выключить',
      success: 'Запрос отправлен',
      error: 'Не удалось отправить запрос, попробуйте позже',
    },
  },
  games: {
    supported: 'Поддерживаемые игры',
    installed: 'Установленные игры',
    available: 'Доступно для установки',
    description: 'Создай свой сервер для игр из списка без боли!',
    status: {
      PLANNED: 'Скоро',
      FULL: 'Полная поддержка',
      INSTALL: 'Доступна установка',
      INSTALLED: 'Установлено',
      AVAILABLE: 'Доступно',
      UNAVAILABLE: 'Недоступно',
      INSTALLATION_STARTED: 'Установка начата',
      INSTALLATION_FAILED: 'Ошибка установки',
    },
    install: 'Установить',
    startToPlay: 'Запустите сервер, чтобы начать игру',
    tabs: {
      server: 'Мои миры',
      main: 'Основная информация',
      requirenments: 'Требования',
    },
  },
  worlds: {
    desciption: 'Описание',
    last: 'Активный',
    save: 'Сделать бэкап',
    one: 'мир',
    delete: {
      success: 'Мир был успешно удален',
    },
    choose: 'Выберите мир, чтобы посмотреть данные',
  },
  providers: {
    supported: 'Поддерживаемые провайдеры',
  },
  backups: {
    nodata: 'Бэкапов пока нет',
    one: 'бэкап',
    delete: {
      success: 'Бэкап был успешно удален',
    },
    upload: {
      label: 'Выберите zip-архив',
      files: 'нет файлов | {n} файл | {n} файла | {n} файлов',
      title: 'Загрузка бэкапа',
      text: 'Выберите zip-архив с файлами бэкапа в корне.\nВы можете найти эти файлы в диреткориях "__путь-до-директории-арка__/ShooterGame/Saved/SavedArks" на сервере или "__путь-до-директории-арка__/ShooterGame/Saved/SavedArksLocal" на локальном компьютере.\nПереименуйте LocalPleyer.arkprofile и LocalPleyer.profilebak на ваш SteamId64, если загружаете локальный бэкап',
    },
    files: {
      title: 'Файлы',
      nodata: 'Файлов не найдено',
    },
  },
  date: {
    title: 'Дата',
    range: 'Период',
    day: 'День',
    month: 'Месяц',
    year: 'Год',
  },
  delete: {
    title: 'Вы уверены?',
    text: 'Вы собираетесь удалить {msg} навсегда. Это действие необратимо. Продолжить?',
  },
  '10': '10',
  '25': '25',
  '50': '50',
  '100': '100',
  KEY_GAME_INSTALLATION_CONFLICT: 'Процесс установки другой игры еще не закончен',
  OK: 'Успешно',
}