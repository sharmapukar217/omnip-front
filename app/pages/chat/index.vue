<script setup lang="ts">
import { Card } from "@/components/ui/card";
</script>

<template>
  <div class="container py-4">
    <div class="flex w-full gap-3 h-[calc(100vh-100px)]">
      <Card.Root class="min-w-96 h-full">
        <Card.Header class="!h-[70px]">
          <Card.Title>Inbox</Card.Title>
        </Card.Header>
        <hr />
      </Card.Root>

      <Card.Root class="w-full">
        <Card.Header>
          <Card.Title>ABC</Card.Title>
        </Card.Header>
        <hr />
        <Card.Content class="flex h-full items-center justify-center">
          <div class="i-bi-inbox !size-80 m-auto" />
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</template>
