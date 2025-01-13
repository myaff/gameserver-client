export default {
  locale: {
    ru: 'Русский',
    en: 'English',
  },
  signin: {
    title: 'Sign in',
    alternate: {
      text: 'Don\'t have an account?',
      btn: 'Signup',
    },
  },
  signup: {
    title: 'Sign up',
    currency: 'Default currency',
    alternate: {
      text: 'Already have an account?',
      btn: 'Signin',
    },
  },
  form: {
    email: {
      label: 'Email',
    },
    username: {
      label: 'Username',
    },
    password: {
      label: 'Password',
    },
    firstName: {
      label: 'First name',
    },
    lastName: {
      label: 'Last name',
    },
    middleName: {
      label: 'Middle name',
    },
    dateFrom: {
      label: 'Date from',
      prefix: 'From',
    },
    dateTo: {
      label: 'Date to',
      prefix: 'To',
    },
    comment: {
      label: 'Comment',
    },
    worldName: {
      label: 'World name',
      error: {
        required: 'World name is required',
        patternMismatch: 'Use only latin characters, digits and symbols -_',
        notUnique: 'World {msg} already exists. World name must be unique for this server and game',
        restricted: 'Please, don\'t use "{msg}" as a world name',
      },
    },
  },
  btn: {
    submit: 'Submit',
    ok: 'OK',
    save: 'Save',
    cancel: 'Cancel',
    reset: 'Reset',
    edit: 'Edit',
    signout: 'Sign out',
    create: 'Create',
    createOne: 'Create {msg}',
    add: 'Add',
    delete: 'Delete',
    deleteOne: 'Delete {msg}',
    addOne: 'Add {msg}',
    restore: 'Restore',
    download: 'Download',
    upload: 'Upload',
    play: 'Play',
    stop: 'Stop',
    comment: 'Comment',
    install: 'Install',
  },
  error: {
    unknown: {
      title: 'Something went wrong!',
      message: 'Please, try again later'
    },
    unrated: {
      title: 'Unrated tracking records found!',
    },
  },
  empty: 'No {msg} found',
  app: {
    title: 'Oh my Deddic',
    titleMobile: 'Oh my Deddic',
  },
  page: {
    home: 'Home',
    servers: 'Servers',
  },
  servers: {
    loading: 'Loading servers...',
    server: 'Server',
    add: {
      title: 'Add server',
      name: {
        label: 'Name',
      },
      ipAddress: {
        label: 'IP address',
      },
      port: {
        label: 'Port',
      },
      provider: {
        label: 'Choose provider',
      },
      os: {
        label: 'Choose OS'
      },
      config: {
        label: 'Fill in following fields for access to provider\'s account and operation system',
        required: 'Field is required',
      },
      success: {
        title: 'Server {msg} has been added successfully'
      },
    },
    delete: {
      tooltip: 'Delete',
      title: 'Are you sure?',
      text: 'This action deletes this server from the system. This action doesn\'t deletes this server from the provider\'s system. Continue?',
      success: 'DELETED. Don\'t forget to remove server from provider',
    },
    edit: {
      tooltip: 'Edit',
      title: 'Edit server data',
      success: {
        title: 'Server {msg} has been edited successfully'
      },
    },
    features: {
      cpu: 'CPU',
      ram: 'RAM',
      disc: 'Disc',
      datacenter: 'Datacenter',
      billing: 'Billing',
    },
    status: {
      on: 'Power On',
      off: 'Power Off',
      success: 'Request has been sent',
      error: 'Request hasn\'t been sent. Try again later',
    }
  },
  games: {
    supported: 'Supported games',
    installed: 'Installed games',
    available: 'Available games',
    description: 'Make a dedicated server for games from the following list without pain',
    status: {
      PLANNED: 'Coming soon',
      FULL: 'Full support',
      INSTALL: 'Install only',
      INSTALLED: 'Installed',
      AVAILABLE: 'Available',
      UNAVAILABLE: 'Unavailable',
      INSTALLATION_STARTED: 'Installation started',
      INSTALLATION_FAILED: 'Installation failed',
    },
    install: 'Install',
    startToPlay: 'Start server to play',
    tabs: {
      server: 'My worlds',
      main: 'Main info',
      requirenments: 'Requirenments',
    },
  },
  worlds: {
    desciption: 'Description',
    last: 'Last played',
    save: 'Create backup',
    one: 'world',
    delete: {
      success: 'The world has been removed successfully',
    },
    choose: 'Choose world to watch data',
  },
  backups: {
    nodata: 'There are no backups yet',
    one: 'backup',
    delete: {
      success: 'The backup has been removed successfully',
    },
    upload: {
      label: 'Choose .zip file',
      files: 'no files | 1 file | {n} files',
      title: 'Upload backup',
      text: 'Choose zip-archive with backup files in root.\nYou can find files in the "__path-to-ark-folder__/ShooterGame/Saved/SavedArks" folder on server or "__path-to-ark-folder__/ShooterGame/Saved/SavedArksLocal" folder on your computer.\nRename LocalPleyer.arkprofile and LocalPleyer.profilebak with your SteamId64 in case of loading local backup',
    },
    files: {
      title: 'Files',
      nodata: 'No files found for the backup',
    },
  },
  providers: {
    supported: 'Supported providers',
  },
  date: {
    title: 'Date',
    range: 'Range',
    day: 'Day',
    month: 'Month',
    year: 'Year',
  },
  delete: {
    title: 'Are you sure?',
    text: 'You are about to delete {msg} permanently. This action is undonable. Continue?',
  },
  '10': '10',
  '25': '25',
  '50': '50',
  '100': '100',
  KEY_GAME_INSTALLATION_CONFLICT: 'Another Installation Process is not completed yet',
  OK: 'Success',
}