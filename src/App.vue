<template>
  <div id="app">
    <h1>CIDR</h1>
    <div class="filter">
      <h2>Filter</h2>
      <div class="slider">
        <button @click="step(false)">
          -
        </button>
        <input
          v-model="cidr"
          type="range"
          min="1"
          max="33"
          step="1"
        >
        <button @click="step(true)">
          +
        </button>
      </div>
      <div class="number">
        <input
          v-model="cidr"
          type="number"
          min="1"
          max="33"
        >
      </div>
    </div>

    <h2>{{ cidr > 32 ? 'Display all' : '/' + cidr }}</h2>
    <table>
      <thead>
        <tr>
          <td>CIDR</td>
          <td>Binary Mask</td>
          <td>Decimal Mask</td>
          <td>Supported Hosts</td>
          <td>Formula</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filteredChart" :key="row.cidr">
          <td>/<span class="cidr" :style="`--value: ${row.cidr + 60}`">{{ row.cidr }}</span></td>
          <td class="binary">
            <span v-for="(group, groupIndex) in row.binary" :key="groupIndex">
              <span class="group" :style="`--value: ${parseInt(group, 2) ? 255 - (parseInt(group, 2)) : 255}`">{{ group }}</span>
              <span v-show="groupIndex !== 3" class="separator">.</span>
            </span>
          </td>
          <td class="decimal">
            <span v-for="(group, groupIndex) in row.decimal" :key="groupIndex">
              <span class="group" :style="`--value: ${Number(group) ? 255 - Number(group) : 255}`">{{ group }}</span>
              <span v-show="groupIndex !== 3" class="separator">.</span>
            </span>
          </td>
          <td class="hosts" :style="`--value: ${(Math.cbrt(row.hosts) / 5).toFixed()}`">
            {{ row.hosts.toLocaleString() }}
          </td>
          <td>2<sup class="pow" :style="`--value: ${32 - row.cidr + 60}`">{{ 32 - row.cidr }}</sup> - 2</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      cidr: 33,
      userIP: '192.168.1.1',
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
    filteredChart() {
      return this.chart.filter((row) => (this.cidr > 32 ? true : row.cidr === Number(this.cidr)));
    },
  },
  methods: {
    step(dir) {
      if (dir) {
        if (this.cidr < 33) {
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
*, ::before, ::after
  box-sizing: border-box
  padding: 0
  margin: 0
  outline: none

::selection
  background-color: darken(rgba($blue, 0.99), 5%)

body
  // font-family: Arial, Helvetica, sans-serif
  font-family: "Courier New", Courier, monospace
  font-size: 1.4rem
  color: white
  background: $bg-color
  display: flex
  justify-content: space-around
  align-items: center
  width: 100vw
  padding: 2em 0

button, input[type="radio"]
  cursor: pointer

button, input[type="text"]
  text-align: center


table
  // font-family: msonospace
  font-size: 1.1rem
  thead tr td
    font-weight: bold
    padding-bottom: 1em

  td:nth-child(1)
    width: 3em
    display: inline-block
    overflow: hidden

thead, tbody
  display: block

tbody
  overflow: scroll
  height: 30vh


td
  padding: 0.2em 1em
  white-space: nowrap

.cidr
  color: hsl(var(--value), 100%, 60%)

.binary
  .group
    color: rgb(var(--value), calc(var(--value) + 130), 255)

.decimal
  .group
    color: rgb(255, var(--value), var(--value))

.hosts
  color: hsl(var(--value), 100%, 60%)

.pow
  color: hsl(var(--value), 100%, 60%)

</style>
