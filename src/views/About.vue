<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>{{ message }}</h2>
  </div>
</template>

<script>
export default {
  props: { message: { type: String, required: true } }
};
</script>
