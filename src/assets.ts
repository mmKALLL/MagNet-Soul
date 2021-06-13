import {EnemyData} from './assets/maps/basic_enemy_data'

export const mapAssets = {
  'stage1-back-parallax': require('./assets/tiles/FreeCuteTileset/BG1.png'),
  'stage1-mid-parallax': require('./assets/tiles/FreeCuteTileset/BG2.png'),
  'stage1-front-parallax': require('./assets/tiles/FreeCuteTileset/BG3.png'),
  'stage1-background': require('./assets/maps/stage1.png'),
  'stage2-back-parallax': require('./assets/tiles/starry-night-by-quintino/background_sky.png'),
  'stage2-mid-parallax': require('./assets/tiles/starry-night-by-quintino/clouds.png'),
  'stage2-front-parallax': require('./assets/tiles/starry-night-by-quintino/clouds.png'),
  'stage2-background': require('./assets/maps/stage2.png'),
}

export const enemyTiles = EnemyData

export const assets = {
  character: require('./assets/sprites/character.png'),
  polaritySwitcher: require('./assets/sprites/switcher.png'),
  ring46: require('./assets/sprites/icons/Accessories and Armor - Clockwork Raven Studios/16x16/tile046.png'),
  turretLeft: require('./assets/sprites/turret.png'),
  hitAnim: [
    require('./assets/sprites/bullet-hit-anim/sprite_00.png'),
    require('./assets/sprites/bullet-hit-anim/sprite_01.png'),
    require('./assets/sprites/bullet-hit-anim/sprite_02.png'),
    require('./assets/sprites/bullet-hit-anim/sprite_03.png'),
    require('./assets/sprites/bullet-hit-anim/sprite_04.png'),
    require('./assets/sprites/bullet-hit-anim/sprite_05.png'),
    require('./assets/sprites/bullet-hit-anim/sprite_06.png'),
    require('./assets/sprites/bullet-hit-anim/sprite_07.png'),
    require('./assets/sprites/bullet-hit-anim/sprite_08.png'),
    require('./assets/sprites/bullet-hit-anim/sprite_09.png'),
  ],

  player: {
    positive: {
      idle: require('./assets/sprites/player_n/player_n0.png'),
      jump: require('./assets/sprites/player_n/player_nj.png'),
      walk: [
        require('./assets/sprites/player_n/player_n0.png'),
        require('./assets/sprites/player_n/player_n1.png'),
        require('./assets/sprites/player_n/player_n0.png'),
        require('./assets/sprites/player_n/player_n2.png'),
      ] as any[],
    },
    negative: {
      idle: require('./assets/sprites/player_s/player_s0.png'),
      jump: require('./assets/sprites/player_s/player_sj.png'),
      walk: [
        require('./assets/sprites/player_s/player_s0.png'),
        require('./assets/sprites/player_s/player_s1.png'),
        require('./assets/sprites/player_s/player_s0.png'),
        require('./assets/sprites/player_s/player_s2.png'),
      ] as any[],
    },
  },
} as const

export const bgmAssets = {
  bgm1: require('./assets/audio/BGM1(short,07500).mp3'),
  bgm2: require('./assets/audio/BGM2(short,08275).mp3'),
  bgm3: require('./assets/audio/BGM3(short,00000).mp3'),
  title: require('./assets/audio/Title.mp3'),
}

export const sfxAssets = {
  gameclear: require('./assets/audio/SE_gameclear.mp3'),
  stageclear: require('./assets/audio/SE_stageclear.mp3'),
  damage: require('./assets/sfx/damage.m4a'),
  item: require('./assets/sfx/item.m4a'),
  jump: require('./assets/sfx/jump.m4a'),
  kill: require('./assets/sfx/kill.m4a'),
  shot1: require('./assets/sfx/shot1.m4a'),
  shot2: require('./assets/sfx/shot2.m4a'),
  reflect: require('./assets/sfx/reflect.m4a'),
}
