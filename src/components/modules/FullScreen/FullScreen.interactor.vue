<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FullScreenInteractor',

  inject: ['gateway'],

  async beforeMount() {
    await this.gateway.setFullScreen();
    this.$emit('update', { isFullScreen: true });
  },

  async beforeDestroy() {
    await this.gateway.setNormalScreen();
    this.$emit('update', { isFullScreen: false });
  },
};
</script>
