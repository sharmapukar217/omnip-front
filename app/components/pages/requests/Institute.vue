<script lang="ts" setup>
import {
  getLocalTimeZone,
  isToday,
  parseDate,
  today,
  type DateValue
} from "@internationalized/date";
import { toTypedSchema } from "@vee-validate/valibot";
import { useMediaQuery } from "@vueuse/core";
import * as v from "valibot";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

// Animation
import { Vue3Lottie } from "vue3-lottie";
import animationFile from "@/assets/animations/stopwatch.json";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Drawer } from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { Popover } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FILTER_STORE_STORAGE_KEY, ROLE } from "@/lib/constants";
import { DAYS } from "@/lib/formSchema";
import { cn, pick } from "@/lib/utils";
import { outgoingRequests, searchStatus } from "@/store";
import type { CustomDirectusTypes } from "@/types/direcus";

import SearchFiltersSaveForm from "@/components/forms/SearchFiltersSaveForm.vue";

const socket = useSocket();
const { readItems, createItem, deleteItem, client } =
  useDirectusItems<CustomDirectusTypes>({
    staticToken: true
  });
const { readUsers, user: currentUser } = useDirectusUsers<CustomDirectusTypes>({
  staticToken: true
});

const fields = [
  {
    name: "Soins_visages",
    options: [
      "soins_nourrissant",
      "soins_nettoyant",
      "soins_purifiant",
      "peeling",
      "soins_eclat",
      "soins_specifique_yeux",
      "soins_matifiant",
      "soins_relaxant",
      "soins_anti_age"
    ]
  },
  {
    name: "Beaute_du_regard",
    options: [
      "maquillage_jour",
      "maquillage_soiree",
      "forfait_mariee",
      "cours_de_maquillage",
      "rehaussement_cil",
      "teinture_cil_sourcil",
      "extension_de_cil",
      "brown_lift",
      "mascara_semi_permanent"
    ]
  },
  {
    name: "Soins_corps",
    options: [
      "gommage_corps",
      "enveloppement_corps",
      "soins_fermete",
      "soins_jambe_legere",
      "soins_minceur",
      "soins_corps_femme_enceinte",
      "soins_du_dos",
      "auto_bronzant",
      "soins_pierre_chaude"
    ]
  },
  {
    name: "Modelages",
    options: [
      "cuir_chevelu",
      "visage",
      "reflexologie_plantaire",
      "drainage_lymphatique",
      "californien",
      "tibetain",
      "relaxant",
      "ayurvedique",
      "future_maman"
    ]
  },
  {
    name: "Epilations",
    options: [
      "sourcil_creation_entretiens",
      "levres_menton_nez_cou_joue_oreille",
      "demi_jambe_jambe",
      "bras_demi_bras",
      "dos_torse_epaule",
      "jambe_complete",
      "aisselles",
      "fesses",
      "mamelons"
    ]
  },
  {
    name: "Epilations_maillot",
    options: ["Simple", "Semi_integrale", "Sif", "Bresilien", "Integrale"]
  },
  {
    name: "Techniques_epilations",
    options: [
      "au_sucre",
      "a_la_pince",
      "cire",
      "epiloderm",
      "au_fil",
      "roll_on",
      "spatule"
    ]
  },
  {
    name: "Soins_mains_pieds",
    options: [
      "Depose_verni_gel_semi_perm",
      "Manucurie",
      "Pose_semi_perm",
      "French_manucure",
      "Pose_gel",
      "Pose_complete_capsule",
      "Pose_complete_chablon",
      "Pose_de_verni_classique",
      "Reparation_ongle",
      "Beaute_pieds",
      "Baby_boomer",
      "Nail_art"
    ]
  },
  {
    name: "Appareils",
    options: [
      "lumiere_pulsee",
      "haute_frequence",
      "ultra_son",
      "vapozone",
      "lpg",
      "ionophorese"
    ]
  },
  {
    name: "Hommes",
    options: [
      "soins_visages",
      "beaute_du_regard",
      "soins_mains_pieds",
      "soins_corps",
      "modelage",
      "epilations",
      "epilations_avec_parties_intimes",
      "epilations_sans_parties_intimes"
    ]
  },
  {
    name: "Protocoles",
    options: [
      "yves_rocher",
      "payot",
      "clarins",
      "thalgo",
      "guinot",
      "ioma",
      "shiseido",
      "phytomer",
      "mary_cohr",
      "phyts",
      "caudalie",
      "themae",
      "carita",
      "decleor"
    ]
  }
] as const;

type Field = (typeof fields)[number];
type FieldName = Field["name"];

/** if optional */
type FieldSchema = v.ArraySchema<
  v.PicklistSchema<Field["options"], undefined>,
  undefined
>;

// prettier-ignore
const prestationSchema = v.object(fields.reduce((obj, field) => {
  obj[field.name] = v.array(v.picklist(field.options));
  return obj
}, {} as Record<FieldName, FieldSchema>));

const { t } = useI18n();
const isDesktop = useMediaQuery("(min-width: 768px)");

const {
  values,
  errors,
  setValues,
  setFieldValue,
  isFieldValid,
  isFieldDirty,
  resetField,
  handleSubmit,
  meta
} = useForm({
  initialValues: {
    date: undefined,
    timeEnd: undefined,
    timeStart: undefined,
    prestation: {
      Appareils: [],
      Beaute_du_regard: [],
      Epilations: [],
      Epilations_maillot: [],
      Hommes: [],
      Modelages: [],
      Protocoles: [],
      Soins_corps: [],
      Soins_mains_pieds: [],
      Soins_visages: [],
      Techniques_epilations: []
    }
  },
  keepValuesOnUnmount: true,
  validationSchema: toTypedSchema(
    v.object({
      date: v.pipe(v.string(), v.minLength(10)),
      prestation: v.pipe(
        prestationSchema,
        v.forward(
          v.check((prestation) => {
            const keys = Object.keys(prestation);
            return keys.some((key) => prestation[key].length > 0);
          }, "Select atleast one field..."),
          ["Appareils"]
        )
      ),
      timeStart: v.optional(v.string()),
      timeEnd: v.optional(v.string())
    })
  )
});

const requestId = ref<number | undefined>();
const selectedValue = ref<string | undefined>(undefined);
const savedValues = ref<Record<string, typeof values>[]>([]);

const prestationFiltersLength = computed(
  () => Object.values(values.prestation || {}).flat().length
);

const calendarValue = computed({
  get: () => (values.date ? parseDate(values.date) : undefined),
  set: (val) => val
});

const handleSearch = handleSubmit(async function (values) {
  searchStatus.value = "searching";

  let userIds: string[] = [];

  const date = new Date(values.date);
  // Step 1: Get user id based on day...
  {
    const data = await readItems("disponibilite", {
      fields: ["user"],
      filter: { [DAYS[date.getDay()]]: { _eq: true } }
    });

    userIds = data.map((d: { user: string }) => d.user);
  }

  // Step 2: Filter these users based on prestatons
  {
    const data = await readItems("prestation", {
      fields: ["user", ...fields.map((f) => f.name)],
      filter: {
        user: { _in: userIds }
        // NOTE: directus doesn't support _in for json field,
        // uncomment this once directus support it
        // ...Object.keys(values.prestation).reduce((obj, key) => {
        //   if (values.prestation[key].length) obj[key] = { _in: values.prestation[key] };
        //   return obj;
        // }, {}),
      }
    });

    userIds = data
      .filter((obj) => {
        return Object.keys(values.prestation).every((key) => {
          if (obj[key]) values.prestation[key].every((item) => obj[key].includes(item));
          return true;
        });
      })
      .map((d) => d.user);
  }

  // Step 3: Find user basic details
  const users = await readUsers({
    fields: ["id", "first_name", "last_name", "avatar", "email", "entreprise"],
    filter: {
      // only select freelance account
      role: { _eq: ROLE.freelancer },

      // exclude current user and find rest
      _and: [{ id: { _neq: currentUser.value!.id } }, { id: { _in: userIds } }]
    }
  });

  console.debug(`/requests findUser(), got ${users.length} user(s).`);

  const response = await createItem(
    "hire_requests",
    { requested_users: users.map((u) => u.id), sent_by: currentUser.value!.id },
    { fields: ["id"] }
  );

  requestId.value = response.id;
  localStorage.setItem("request-id", response.id);

  // outgoingRequests.value = users;

  await client.request(() => ({
    method: "POST",
    path: "/firebase/push-notification",
    body: JSON.stringify({
      target: "users",
      title: "New hire request",
      body: `${currentUser.value?.first_name} from ${currentUser.value.entreprise} is sending you hire request.`,
      userIds: users.map((u) => u.id),
      messagePayload: {}
    })
  }));

  users.forEach((user) => {
    console.debug(`Sending request to ${user.first_name} ${user.last_name} (${user.id})`);
    // outgoingRequests.value=outgoingRequests.push()

    socket.emit(user.id, {
      // timestamp: now,
      event: "hire-request:requesting",
      requestedBy: pick(currentUser.value!, [
        "id",
        "avatar",
        "entreprise",
        "first_name",
        "last_name"
      ])
    });
  });
});

const cancelSearching = () => {
  searchStatus.value = "idle";

  if (requestId.value) {
    toast.info(t("message.loading"));

    deleteItem("hire_requests", requestId.value!)
      .then(() => {
        requestId.value = undefined;
        localStorage.removeItem("request-id");
        toast.success("Request cancelled!");
      })
      .catch(() => toast.error(t("message.oops")));
  }

  // outgoingRequests.value.forEach((user) => {
  //   console.debug(
  //     `Cancelling request, ${user.first_name} ${user.last_name} (${user.id})`
  //   );
  //   socket.emit(user.id, {
  //     event: "hire-request:cancelled",
  //     rejectedBy: pick(currentUser.value!, [
  //       "id",
  //       "avatar",
  //       "entreprise",
  //       "first_name",
  //       "last_name"
  //     ])
  //   });
  // });

  outgoingRequests.value = [];
};

const clearSavedFilters = () => {
  localStorage.removeItem(FILTER_STORE_STORAGE_KEY);
  toast.success("All saved filters deleted successfully!");
  savedValues.value = [];
};

const removeSelectedFilter = (id: string) => {
  savedValues.value = savedValues.value.filter((v) => v.id !== id);
  localStorage.setItem(FILTER_STORE_STORAGE_KEY, JSON.stringify(savedValues.value));
};

const { status } = useAsyncData(
  async () => {
    const id = Number(localStorage.getItem("request-id"));

    const requests = await readItems("hire_requests", {
      fields: [],
      filter: { id: { _eq: id } }
    });

    if (requests.length) {
      requestId.value = id;
      searchStatus.value = "searching";
    } else {
      localStorage.removeItem("request-id");
    }
  },
  { server: false }
);

onMounted(() => {
  const values = localStorage.getItem(FILTER_STORE_STORAGE_KEY);
  if (!values) return;

  try {
    const jsonValue = JSON.parse(values) || [];
    console.debug(`DONE: ${jsonValue.length} FILTER VALUE(S) LOADED`);
    savedValues.value = jsonValue;
  } catch {
    console.error("/requests ERR: DEFECTED FILTER STORAGE");
    localStorage.removeItem(FILTER_STORE_STORAGE_KEY);
  }
});

watch(values, () => {
  selectedValue.value = undefined;
});
</script>

<template>
  <div class="container py-4">
    <!-- skeleton -->
    <div
      v-if="status === 'pending'"
      class="bg-background text-foreground rounded-xl border shadow p-3 grid gap-x-1.5 gap-y-2.5 mb-4">
      <div class="flex flex-wrap gap-1.5">
        <div class="h-8 px-11 border rounded-md bg-muted animate-pulse" />
        <div class="h-8 px-20 border rounded-md bg-muted animate-pulse" />
        <div class="h-8 px-14 border rounded-md bg-muted animate-pulse" />
      </div>

      <div class="flex gap-2">
        <div class="h-8 w-full border rounded-md bg-muted animate-pulse" />
        <div class="h-8 w-full border rounded-md bg-muted animate-pulse" />
      </div>

      <div class="mt-3">
        <div class="flex items-center justify-between">
          <div class="h-5 w-16 border rounded bg-muted" />
          <div class="h-5 w-20 border rounded bg-muted" />
        </div>

        <div class="grid gap-2 mt-4">
          <template v-for="x in Math.floor(Math.random() * 3) + 1" :key="x">
            <div
              class="flex w-full border rounded-md bg-background px-2 py-3 animate-pulse">
              <div class="space-y-2 w-full">
                <div class="h-4 w-20 border rounded bg-muted" />
                <div class="h-4 w-1/2 border rounded bg-muted" />
              </div>

              <div
                class="size-7 flex-shrink-0 rounded-full border bg-muted my-auto me-2" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <template v-else>
      <div
        class="bg-background text-foreground rounded-xl border shadow p-3 grid gap-x-1.5 gap-y-2.5">
        <form class="contents" @submit="handleSearch">
          <div class="flex flex-wrap gap-1.5">
            <!-- date field -->
            <Form.Field name="date">
              <Popover.Root>
                <Popover.Trigger as-child>
                  <Button
                    size="sm"
                    :ring="false"
                    :disabled="searchStatus === 'searching'"
                    :variant="values.date ? 'default' : 'ghost'"
                    :class="errors.date && '!ring-2 !ring-destructive'">
                    <div class="i-bi-calendar-date" />
                    <span class="mx-3">{{ $t("label.date") }}</span>
                  </Button>
                </Popover.Trigger>
                <Popover.Content
                  class="flex w-auto flex-col gap-y-2 p-2 mt-2"
                  align="start">
                  <Calendar
                    v-model="calendarValue"
                    :min-value="today(getLocalTimeZone())"
                    :is-date-disabled="
                      (d: DateValue) => isToday(d) && new Date().getHours() >= 10
                    "
                    @update:model-value="
                      (v?: DateValue) => setFieldValue('date', v?.toString())
                    " />

                  <Button
                    size="sm"
                    type="button"
                    :disabled="
                      searchStatus === 'searching' || new Date().getHours() >= 10
                    "
                    @click="
                      () => setFieldValue('date', today(getLocalTimeZone()).toString())
                    ">
                    {{ $t("label.today") }}
                  </Button>
                </Popover.Content>
              </Popover.Root>
            </Form.Field>

            <Drawer.Root :direction="isDesktop ? 'right' : 'bottom'">
              <Drawer.Trigger as-child>
                <Button
                  size="sm"
                  :ring="false"
                  :disabled="searchStatus === 'searching'"
                  :variant="prestationFiltersLength ? 'default' : 'ghost'"
                  :class="!isFieldValid('prestation') ? '!ring-2 !ring-destructive' : ''">
                  <div>Prestation</div>
                  <div
                    :class="
                      cn(
                        'border rounded-xl px-2 py-0 ms-2 text-xs',
                        prestationFiltersLength
                          ? 'bg-muted text-foreground'
                          : 'bg-foreground text-background'
                      )
                    ">
                    {{ prestationFiltersLength }} filter(s)
                  </div>
                </Button>
              </Drawer.Trigger>

              <Drawer.Content
                :direction="isDesktop ? 'right' : 'bottom'"
                class="h-[87%] md:h-full">
                <div class="size-full flex flex-col">
                  <Drawer.Header class="px-0">
                    <Drawer.Title>Filters for prestation</Drawer.Title>
                    <template v-if="errors.prestation?.Appareils">
                      <small class="text-[0.8rem] font-medium text-destructive">
                        {{ errors.prestation.Appareils }}
                      </small>
                    </template>
                  </Drawer.Header>

                  <ScrollArea class="px-3" data-vaul-no-drag>
                    <div v-for="field in fields" :key="field" class="border-b py-4">
                      <div class="flex items-baseline justify-between">
                        <div
                          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-4">
                          {{ $t(`label.${field.name}`) }}
                        </div>
                        <template v-if="!isFieldDirty(`prestation.${field.name}`)">
                          <button
                            type="button"
                            class="me-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                            @click="
                              () =>
                                setFieldValue(
                                  `prestation.${field.name}`,
                                  fields.find((f) => f.name === field.name)?.options,
                                  true
                                )
                            ">
                            Select all
                          </button>
                        </template>
                        <template v-else>
                          <button
                            type="reset"
                            class="me-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                            @click="() => resetField(`prestation.${field.name}`)">
                            Reset
                          </button>
                        </template>
                      </div>

                      <div class="flex flex-wrap gap-3">
                        <label v-for="option in field.options" :key="option">
                          <Form.Field
                            :value="option"
                            type="checkbox"
                            :name="`prestation.${field.name}`"
                            class="peer hidden" />
                          <div
                            class="border-2 text-sm font-medium p-2 rounded-3xl cursor-pointer peer-checked:border-primary">
                            {{ $t(`options.${field.name}.${option}`) }}
                          </div>
                        </label>
                      </div>
                    </div>
                  </ScrollArea>

                  <Drawer.Footer class="pb-8 md:pb-4 border-t md:flex md:flex-row">
                    <template v-if="isFieldDirty('prestation')">
                      <Button
                        class="w-full"
                        variant="secondary"
                        @click="() => resetField('prestation')">
                        Reset all
                      </Button>
                    </template>
                    <template v-else>
                      <Drawer.Close as-child>
                        <Button variant="secondary" class="w-full">Cancel</Button>
                      </Drawer.Close>
                    </template>

                    <Drawer.Close as-child>
                      <Button variant="default" class="w-full">Continue</Button>
                    </Drawer.Close>
                  </Drawer.Footer>
                </div>
              </Drawer.Content>
            </Drawer.Root>

            <!-- timeslot field -->
            <Popover.Root>
              <Popover.Trigger as-child>
                <Button
                  size="sm"
                  :ring="false"
                  class="relative"
                  :disabled="searchStatus === 'searching'"
                  :variant="values.timeStart && values.timeEnd ? 'default' : 'muted'"
                  :class="
                    (errors.timeStart || errors.timeEnd) && '!ring-2 !ring-destructive'
                  ">
                  <div class="i-bi-clock-history" />
                  <span class="mx-3">{{ $t("label.time.slots") }}</span>
                </Button>
              </Popover.Trigger>
              <Popover.Content align="start" class="w-fit">
                <h1 class="text-sm font-semibold text-muted-foreground">
                  {{ $t("search.time.slots") }}
                </h1>

                <div class="flex gap-4">
                  <Form.Field v-slot="{ componentField }" name="timeStart">
                    <Form.Item class="mt-4 w-full">
                      <Form.Label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {{ $t("label.time.start") }}
                      </Form.Label>
                      <Form.Control>
                        <Form.Input v-bind="componentField" type="time" />
                      </Form.Control>
                    </Form.Item>
                  </Form.Field>

                  <Form.Field v-slot="{ componentField }" name="timeEnd">
                    <Form.Item class="mt-4 w-full">
                      <Form.Label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {{ $t("label.time.end") }}
                      </Form.Label>
                      <Form.Control>
                        <Form.Input v-bind="componentField" type="time" />
                      </Form.Control>
                    </Form.Item>
                  </Form.Field>
                </div>

                <template v-if="values.timeStart || values.timeEnd">
                  <Button
                    size="sm"
                    type="button"
                    class="w-full mt-4"
                    variant="destructive"
                    @click="
                      () => {
                        setFieldValue('timeEnd', undefined);
                        setFieldValue('timeStart', undefined);
                      }
                    "
                    >{{ $t("message.reset") }}</Button
                  >
                </template>
              </Popover.Content>
            </Popover.Root>
          </div>

          <div class="flex flex-col md:flex-row gap-2">
            <template v-if="searchStatus === 'searching'">
              <Button
                size="sm"
                type="button"
                class="w-full"
                variant="destructive"
                @click="cancelSearching">
                Cancel
              </Button>
            </template>
            <template v-else>
              <SearchFiltersSaveForm
                :values="values"
                :disabled="!meta.valid"
                :on-save="(v: unknown) => (savedValues = [v, ...savedValues])" />
            </template>

            <Button
              size="sm"
              type="submit"
              class="w-full"
              :loading="searchStatus === 'searching'"
              :disabled="!meta.valid">
              Start Searching
            </Button>
          </div>
        </form>

        <template v-if="searchStatus === 'searching'">
          <div class="grid place-items-center py-8">

            <Vue3Lottie
              :animation-data="animationFile"
              class="w-full h-64"
              :height="256"
              :width="256" />

            <div class="grid mt-8 place-items-center text-center">
              <div class="text-sm font-medium text-muted-foreground">
                Please wait while searching...
              </div>
              <div class="text-xs font-medium text-muted-foreground">
                You'd be notified if someone accepts your request.
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <template v-if="savedValues.length">
            <div
              class="py-2 mt-2 border-t border-muted flex items-center justify-between">
              <h1 class="text-sm font-medium text-foreground/70">Saved searches</h1>

              <AlertDialog>
                <AlertDialogTrigger
                  type="button"
                  class="text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground hover:underline">
                  Clear all
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sure to delete?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to clear all saved filters?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel> Cancel </AlertDialogCancel>
                    <AlertDialogAction @click="clearSavedFilters">
                      Yes, delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <button
              v-for="(history, idx) in savedValues"
              :key="idx"
              :class="
                cn(
                  'relative grid text-left bg-background hover:ring-2 hover:ring-border hover:bg-muted/70 p-2 rounded-md cursor-pointer transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background',
                  history.id === selectedValue &&
                    'ring-2 ring-offset-2 ring-primary ring-offset-background'
                )
              "
              @click="
                () => {
                  selectedValue = history.id;
                  const data = savedValues.find((v) => v.id === selectedValue);
                  setValues(data?.values, true);
                }
              ">
              <div class="flex items-center space-x-3">
                <h1 class="font-medium text-base">{{ history.title }}</h1>
                <h2 class="text-muted-foreground font-medium text-xs">
                  {{ new Date(history.createdAt).toLocaleDateString() }}
                </h2>
              </div>
              <span class="text-sm text-muted-foreground font-medium">
                {{ history.description }}
              </span>

              <a
                href="#"
                class="absolute right-4 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                @click.prevent.stop="() => removeSelectedFilter(history.id)">
                <div class="i-lucide-trash" />
              </a>
            </button>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>
