<template>
  <div id="app">
    <keep-alive include="PlayerHeader,PlayerFooter,PlayerControl,Header,ChatTabs,HDPraise,Slide">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

</style>
