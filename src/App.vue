<template>
  <div id="app">
    <h1 class="title">
      IPv4 Classless Inter-Domain Routing
    </h1>
    <div class="slider-container">
      <div class="slider-labels">
        <span
          v-for="n in 34"
          :key="n"
          :class="{all: n === 34, current: n-1 === Number(cidr)}"
          @click="() => cidr=n-1"
        >{{ n === 34 ? 'All' : n - 1 }}</span>
      </div>
      <div class="slider">
        <button :disabled="!Number(cidr)" @click="step(false)">
          &lt;
        </button>
        <input
          ref="sliderInput"
          v-model="cidr"
          type="range"
          min="0"
          max="33"
          step="1"
        >
        <button :disabled="Number(cidr) === 33" @click="step(true)">
          &gt;
        </button>
      </div>
    </div>

    <div class="grid-container">
      <h3 class="cidr-column">
        CIDR
      </h3>
      <h3>Binary Mask</h3>
      <h3 class="decimal-column">
        Decimal Mask
      </h3>
      <h3>Supported Hosts</h3>
      <h3>Formula</h3>
      <template v-for="row in chart">
        <div class="grid-cell cidr">
          /<span class="cidr-number" :style="`--value: ${row.cidr + 60}`">{{ row.cidr }}</span>
        </div>
        <div class="grid-cell binary">
          <span v-for="(group, groupIndex) in row.binary" :key="groupIndex">
            <span class="group">{{ group }}
              <span v-for="(digit, index) in group" :key="index" :style="`--value: ${digit * 255}`">{{ digit }}</span>
            </span>
            <span v-show="groupIndex !== 3" class="separator">.</span>
          </span>
        </div>
        <div class="grid-cell decimal">
          <span v-for="(group, groupIndex) in row.decimal" :key="groupIndex">
            <span class="group" :style="`--value: ${Number(group) ? 255 - Number(group) : 255}`">{{ group }}</span>
            <span v-show="groupIndex !== 3" class="separator">.</span>
          </span>
        </div>
        <div class="grid-cell hosts" :style="`--value: ${(Math.cbrt(row.hosts) / 5).toFixed()}`">
          {{ row.hosts.toLocaleString() }}
        </div>
        <div class="grid-cell">
          2<sup class="pow" :style="`--value: ${32 - row.cidr + 60}`">{{ 32 - row.cidr }}</sup> - 2
        </div>
      </template>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

export default {
  name: 'App',
  data() {
    return {
      cidr: '33',
    };
  },
  computed: {
    chart() {
      return Array(33).fill(0).map((_, index) => {
        const binary = Array(index + 1).join('1') + Array(32 - index + 1).join('0');
        const hosts = (2 ** (32 - index)) - 2;
        return {
          cidr: index,
          binary: binary.match(/.{1,8}/g),
          decimal: Array(4).fill(0).map((_2, octet) => parseInt(binary.slice(octet * 8, (octet + 1) * 8), 2)),
          hosts: hosts > 0 ? hosts : 0,
        };
      });
    },
  },
  watch: {
    async cidr(current, previous) {
      if (Number(current) === 33) {
        document.querySelectorAll('.grid-container .grid-cell')
          .forEach((el) => {
            el.style.display = 'block';
          });

        this.$refs.sliderInput.style.transitionDuration = '2s';
        this.$refs.sliderInput.style.backgroundPosition = '0% 75%';
        await sleep(2000);
        this.$refs.sliderInput.style.animation = 'rainbow 60s ease infinite';
      } else {
        document.querySelectorAll('.grid-container .grid-cell')
          .forEach((el) => {
            el.style.display = 'none';
          });
        document.querySelectorAll(`.grid-container .grid-cell:nth-child(n+${(current * 5) + 6}):nth-child(-n+${(current * 5) + 10})`)
          .forEach((el) => {
            el.style.display = 'block';
          });

        if (Number(previous) === 33) {
          this.$refs.sliderInput.style.backgroundPosition = window.getComputedStyle(this.$refs.sliderInput).getPropertyValue('background-position');
          this.$refs.sliderInput.style.animation = 'unset';
          await sleep(50);
        } else {
          this.$refs.sliderInput.style.transitionDuration = '0.2s';
        }
        this.$refs.sliderInput.style.backgroundPosition = `${(current / 33 * 50) + 25}% ${(current / 33 * 50) + 25}%`;
      }
    },
  },
  methods: {
    step(dir) {
      if (dir) {
        if (Number(this.cidr) < 33) {
          this.cidr = Number(this.cidr) + 1;
        }
      } else if (this.cidr > 0) {
        this.cidr = Number(this.cidr) - 1;
      }
    },
  },
};
</script>

<style lang="sass">
$green: #4bad48
$blue: #38a5b8
$bg-color: #1f232c
$white: #efefef
$grey: desaturate(lighten($bg-color, 40%), 10%)

@keyframes rainbow
  0%
    background-position: 0% 75%
  @for $i from 1 through 28
    $keyframe: #{($i * 10)+ "%"}
    #{$keyframe}
      background-position: #{random(100)+"%"} #{(random(40) + 25)+"%"}
  100%
    background-position: 0% 75%


*, ::before, ::after
  box-sizing: border-box
  padding: 0
  margin: 0
  outline: none

::selection
  background-color: rgba($blue, 0.3)

body
  font-family: "Courier New", Courier, monospace
  font-size: 1.4rem
  color: white
  background: $bg-color
  display: flex
  justify-content: space-around
  min-width: 100vw
  max-height: 100vh
  // min-width: 65rem
  overflow: hidden
  position: relative

  &::after
    content: 'Made by Łukasz Wielgus'
    position: fixed
    bottom: 0.2em
    right: 0.5em
    color: $grey
    font-size: 0.8rem


#app
  width: 100vw
  max-height: 100vh
  padding: 1em
  max-width: 60em
  display: flex
  flex-direction: column
  position: relative


.title
  text-align: center
  font-size: 3vw
  margin: 1rem 0

.slider-container
  width: 100%
  margin: 1.5em 0

  .slider-labels
    overflow: hidden
    display: flex
    justify-content: space-between
    padding: 0 1.5em

    span
      color: #aaa
      font-size: 0.95rem
      width: 4em
      text-align: center
      cursor: pointer
      transition: color 0.1s ease-in-out
      &:hover, &.current
        color: white

      &.all
        font-weight: bold
        font-size: 1.1rem
        transform: translateY(-0.06rem)

  .slider
    display: flex
    justify-content: space-between
    align-items: center


    button
      text-align: center
      cursor: pointer
      border: none
      background: none
      height: 1em
      color: #ddd
      font-size: inherit
      font-weight: bold
      text-shadow: 1px 1px 20px black
      transition: color 0.1s ease-in-out

      &:hover
        color: white

      &:disabled
        color: $grey
        cursor: default

    input[type="range"]
      cursor: pointer
      flex-grow: 1
      margin: 0 1em
      width: 100%
      background: transparent
      -webkit-appearance: none
      display: block
      background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)
      background-size: 300% 20000%
      animation: rainbow 60s ease infinite
      border-radius: 1px
      overflow: hidden
      transition: background 2s ease-in-out

      &::-webkit-slider-thumb
        -webkit-appearance: none
        border: 1px solid #000000
        height: 1em
        width: 4em
        background: white
        cursor: pointer
        border: none
        opacity: 0.9
        box-shadow: 0 0 5px 5px rgba(black, 0.2)
        transition: box-shadow 0.05s ease-in-out

      &:active::-webkit-slider-thumb
        box-shadow: 0 0 5px 5px rgba(black, 0.1)


      &::-webkit-slider-runnable-track
        width: 100%

      &:focus
        outline: none

.grid-container
  display: grid
  grid-template-columns: repeat(5, max-content)
  column-gap: 2em
  row-gap: 0.2em
  overflow-y: scroll
  overflow-x: auto
  justify-content: space-between
  padding-right: 0.2em
  flex-grow: 1

  &::-webkit-scrollbar
    width: 4px
    height: 8px
  &::-webkit-scrollbar-thumb
    background-color: #ddd
  &::-webkit-scrollbar-track
    background-color: #aaa

  h3, .grid-cell.cidr
    background-color: $bg-color
    position: sticky

  h3
    top: 0
    z-index: 2

  .grid-cell.cidr, .cidr-column
    z-index: 1
    left: 0

  .cidr-column
    z-index: 3 !important

  .grid-cell
    transition: opacity 0.2s

  .decimal-column
    width: 8em

  .cidr-number
    color: hsl(var(--value), 100%, 60%)

  .binary
    .group
      .digit
        color: rgb(0, 0, var(--value))
      // color: rgb(var(--value), calc(var(--value) + 130), 255)

  .decimal
    .group
      color: rgb(255, var(--value), var(--value))

  .hosts
    color: hsl(var(--value), 100%, 60%)

  .pow
    color: hsl(var(--value), 100%, 60%)

@media (max-width: 700px)
  body::after
    display: none
  #app
    padding: 0.3em

  .title
    font-size: 1.2rem

  .slider-labels
    opacity: 0

</style>
