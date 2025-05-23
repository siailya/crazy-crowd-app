<template>
  <captcha-card
    title="Генерация аватара"
    class="mx-auto"
  >
    <span>Для продолжения генерации сгенерируйте свой аватар</span>
    <div
      class="flex flex-col items-center space-y-4 p-4"
      style="max-width: 200px"
    >
      <!-- Аватар с текущими пропсами -->
      <Avataaars v-bind="avatarProps"/>

      <!-- Кнопка для рандома -->
      <n-button
        style="margin-top: 20px;"
        @click="randomize"
        :disabled="disable"
      >
        Рандом
      </n-button>

      <n-button
        style="margin-top: 20px;"
        @click="save"
        :disabled="disable"
      >
        Сохранить
      </n-button>

      <p v-if="disable">
        Спасибо, ваш аватар навсегда сохранен!
      </p>
    </div>
  </captcha-card>
</template>

<script setup lang="ts">
import {reactive, defineEmits, defineProps} from 'vue';
import Avataaars from 'vuejs-avataaars/src/Avataaars.vue';
import CaptchaCard from "@/pages/auth/captcha/CaptchaCard.vue";

type AvatarProps = {
  isCircle: boolean
  circleColor: string
  accessoriesType: string
  clotheType: string
  clotheColor: string
  eyebrowType: string
  eyeType: string
  facialHairType: string
  facialHairColor: string
  graphicType: string
  hairColor: string
  mouthType: string
  skinColor: string
  topType: string
  topColor: string
}

const accessoriesTypeList = [
  'Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'
];
const clotheTypeList = [
  'BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie',
  'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'
];
const clotheColorList = [
  'Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather',
  'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow',
  'Pink', 'Red', 'White'
];
const eyebrowTypeList = [
  'Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural',
  'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural',
  'UnibrowNatural', 'UpDown', 'UpDownNatural'
];
const eyeTypeList = [
  'Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts',
  'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'
];
const facialHairTypeList = [
  'Blank', 'BeardMedium', 'BeardLight', 'BeardMagestic',
  'MoustacheFancy', 'MoustacheMagnum'
];
const facialHairColorList = [
  'Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown',
  'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'
];
const graphicTypeList = [
  'Bat', 'Cumbia', 'Deer', 'Diamond', 'Hola', 'Pizza',
  'Resist', 'Selena', 'Bear', 'SkullOutline', 'Skull'
];
const hairColorList = [
  'Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown',
  'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'
];
const mouthTypeList = [
  'Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace',
  'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue',
  'Twinkle', 'Vomit'
];
const skinColorList = [
  'Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'
];
const topTypeList = [
  'NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1',
  'WinterHat2', 'WinterHat3', 'WinterHat4', 'LongHairBigHair',
  'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy',
  'LongHairDreads', 'LongHairFrida', 'LongHairFro', 'LongHairFroBand',
  'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairMiaWallace',
  'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand',
  'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle',
  'ShortHairShaggyMullet', 'ShortHairShortCurly', 'ShortHairShortFlat',
  'ShortHairShortRound', 'ShortHairShortWaved', 'ShortHairSides',
  'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart'
];
const topColorList = clotheColorList;

// Состояние текущих пропсов
const avatarProps = reactive<AvatarProps>({
  isCircle: true,
  circleColor: '#6fb8e0',
  accessoriesType: '',
  clotheType: '',
  clotheColor: '',
  eyebrowType: '',
  eyeType: '',
  facialHairType: '',
  facialHairColor: '',
  graphicType: '',
  hairColor: '',
  mouthType: '',
  skinColor: '',
  topType: '',
  topColor: ''
});

// Функция для выбора случайного элемента из массива
function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Заполняем случайными значениями
function randomize() {
  avatarProps.isCircle = Math.random() < 0.5;
  // Для circleColor можно задать случайный цвет или оставить по дефолту
  avatarProps.circleColor = avatarProps.isCircle
    ? `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`
    : avatarProps.circleColor;

  avatarProps.accessoriesType = rand(accessoriesTypeList);
  avatarProps.clotheType = rand(clotheTypeList);
  avatarProps.clotheColor = rand(clotheColorList);
  avatarProps.eyebrowType = rand(eyebrowTypeList);
  avatarProps.eyeType = rand(eyeTypeList);
  avatarProps.facialHairType = rand(facialHairTypeList);
  avatarProps.facialHairColor = rand(facialHairColorList);
  avatarProps.graphicType = rand(graphicTypeList);
  avatarProps.hairColor = rand(hairColorList);
  avatarProps.mouthType = rand(mouthTypeList);
  avatarProps.skinColor = rand(skinColorList);
  avatarProps.topType = rand(topTypeList);
  avatarProps.topColor = rand(topColorList);
}

// Инициализируем случайными значениями при монтировании
randomize();

const emit = defineEmits(['save']);
const {disable} = defineProps<{ disable: boolean }>();

const save = () => {
  emit('save', avatarProps);
};
</script>
