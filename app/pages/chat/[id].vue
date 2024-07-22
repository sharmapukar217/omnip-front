<script setup lang="ts">
import { Card } from "@/components/ui/card";
</script>

<template>
  <div class="container py-4">
    <div class="flex w-full gap-3">
      <Card.Root class="min-w-96">
        <Card.Header></Card.Header>
        <Card.Content></Card.Content>
      </Card.Root>

      <Card.Root class="w-full">
        <Card.Header> </Card.Header>
        <Card.Content></Card.Content>
      </Card.Root>
    </div>
  </div>
</template>
