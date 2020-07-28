<template>
  <div>
    <v-row>
      <v-col md="3" offset="3" class="mt-10">
        <h1 class="display-2 indigo--text">Create post</h1>
        <h1 class="subtitle-1 indigo--text">Your post will be published to your followers</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4" offset="3" class="mt-3 pb-0">
        <v-form v-model="valid">
          <v-textarea outlined label="Add your post" :rules="rules" v-model="text" rows="4" />
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4" offset="3" class="d-flex justify-end pt-0">
        <v-btn color="primary" :disabled="!valid" @click="add">Post</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CreatePost",
  layout: "full",
  middleware: "auth",
  metaInfo() {
    return { title: "Create post" };
  },
  data: () => ({
    text: "",
    valid: false,
    rules: [
      v => v.length <= 500 || "Max 500 characters",
      v => v.length >= 1 || "Min 1 character"
    ]
  }),
  methods: {
    async add() {
      await axios.post("/api/posts/", {
        text: this.text
      });

      this.$store.commit("setGlobalSnackbar", {
        type: "info",
        text: "Added post"
      });

      this.$router.push({name: 'home'})
    }
  }
};
</script>
