<script lang="ts" setup></script>

<template>
  <v-app>
    <v-container>
      <div class="d-flex justify-end">
        <div class="w-auto">
          <LangSelector />
        </div>
      </div>
    </v-container>
    <v-container class="my-auto">
      <v-sheet rounded max-width="600" class="ma-auto py-10 px-12">
        <RouterView />
      </v-sheet>
    </v-container>
  </v-app>
</template>