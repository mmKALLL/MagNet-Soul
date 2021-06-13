export const assets = {
  character: require('./assets/sprites/character.png'),
  polaritySwitcher: require('./assets/sprites/icons/Accessories and Armor - Clockwork Raven Studios/16x16/tile021.png'),
  tileset1: require('./assets/tiles/starry-night-by-quintino/Tileset.png'),
  tileset2: require('./assets/tiles/starry-night-by-quintino/clouds.png'),
  tileset3: require('./assets/tiles/starry-night-by-quintino/background_sky.png'),
  ring46: require('./assets/sprites/icons/Accessories and Armor - Clockwork Raven Studios/16x16/tile046.png'),
  baseBackground1: require('./assets/tiles/html-game-test.png'),

  player: {
    positive: {
      idle: require('./assets/sprites/player_n/player_n0.png'),
      jump: require('./assets/sprites/player_n/player_nj.png')
    },
    negative: {
      idle: require('./assets/sprites/player_s/player_s0.png'),
      jump: require('./assets/sprites/player_s/player_sj.png'),
    }
  }
} as const

export const bgmAssets = {
  bgm1: require('./assets/audio/BGM1(short,07500).mp3'),
  bgm2: require('./assets/audio/BGM2(short,08275).mp3'),
  bgm3: require('./assets/audio/BGM3(short,00000).mp3'),
  title: require('./assets/audio/Title.mp3'),
}

export const sfxAssets = {
  gameclear: './assets/audio/SE_gameclear.mp3',
  stageclear: './assets/audio/SE_stageclear.mp3',
}
