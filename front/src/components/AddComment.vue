<template>
  <v-form v-model="valid">
    <v-textarea
      outlined
      label="Add your comment"
      :rules="rules"
      v-model="text"
      rows="2"
    />
  </v-form>
</template>
<script>

  export default {
    name: 'AddComment',
    props: {
      postId: {
        type: Number,
        required: true
      }
    },
    data: () => ({
      text: '',
      valid: false,
      rules: [
        v => v.length <= 500 || 'Max 500 characters',
        v => v.length >= 1 || 'Min 1 character',
      ]
    }),
    watch: {
      valid() {
        this.$emit('valid', this.valid)
      },
      text() {
        this.$emit('text', this.text)
      }
    }
  }
</script>
