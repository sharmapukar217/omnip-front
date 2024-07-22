FOR EVERY VUE COMPONENTS/ROUTES, PLEASE MAINTAIN FOLLOWING STRUCTURE ALONG WITH COMMENTS

```vue
<script setup lang="ts">
// imports from node modules
// imports from src

/** constants */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** composables */
const something = useDirectusSomething();

/** refs */
const refValue = ref();

/** functions and handler */

/** Please explain what this function do if name is not clear */
const doThis = () => {};
</script>

<template></template>
`
```
