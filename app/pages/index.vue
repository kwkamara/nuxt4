<template>

  <!-- page header -->
  <div class="p-4 flex items-center justify-between border-b border-default/60 bg-default/80 backdrop-blur">

    <!-- title -->
    <h1 class="text-lg font-semibold text-highlighted">Nuxt 4</h1>

    <!-- actions -->
    <div class="flex items-center gap-10">

      <ChatBox/>


      <!-- calendar toggle -->
      <UPopover>
        <UButton icon="i-lucide-calendar" color="neutral" variant="ghost" aria-label="Calendar"/>
        <template #content>
          <UCard class="p-3">
            <UCalendar v-model="calendar_value"/>
          </UCard>
        </template>
      </UPopover>
      <!-- /calendar toggle -->


      <!-- notifications toggle -->
      <UPopover>
        <template #default>
          <div class="relative">
            <UButton aria-label="Notifications"
                     color="neutral"
                     icon="i-lucide-bell"
                     variant="ghost"/>
            <span
              class="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-error-500 ring-2 ring-default"
            />
          </div>
        </template>
        <template #content>
          <UCard class="w-72 p-3 space-y-3">

            <div class="space-y-2 mb-5">
              <p class="text-xs font-medium uppercase tracking-wide text-muted">Notifications</p>
              <template v-for="(item, idx) in notifications" :key="item.id">
                <div class="space-y-1.5">
                  <p class="text-sm text-highlighted">{{ item.title }}</p>
                  <p class="text-xs text-muted">{{ item.time }}</p>
                </div>
                <USeparator v-if="idx < notifications.length - 1" class="my-1"/>
              </template>
            </div>

            <UButton
              label="Open notifications"
              color="primary"
              variant="subtle"
              class="w-full justify-center"
            />
          </UCard>
        </template>
      </UPopover>

      <!-- messages toggle -->
      <UPopover>
        <template #default>
          <div class="relative">
            <UButton
              icon="i-lucide-mail"
              color="neutral"
              variant="ghost"
              aria-label="Messages"
            />
            <span
              class="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-primary-500 ring-2 ring-default"
            />
          </div>
        </template>
        <template #content>
          <UCard class="w-72 p-3 space-y-3">

            <div class="space-y-2 mb-5">
              <p class="text-xs font-medium uppercase tracking-wide text-muted">Messages</p>
              <template v-for="(item, idx) in messages" :key="item.id">
                <div class="space-y-1.5">
                  <p class="text-sm text-highlighted">{{ item.preview }}</p>
                  <p class="text-xs text-muted">{{ item.meta }}</p>
                </div>
                <USeparator v-if="idx < messages.length - 1" class="my-1"/>
              </template>
            </div>

            <UButton
              label="Open inbox"
              color="primary"
              variant="subtle"
              class="w-full justify-center"
            />
          </UCard>
        </template>
      </UPopover>

      <!-- sign out -->
      <UButton
        icon="i-lucide-log-out"
        color="neutral"
        variant="ghost"
        aria-label="Sign out"
        class="transition-colors hover:text-error-500"
      />
    </div>
  </div>
  <!-- /page header -->


  <!-- main grid -->
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 p-5">

    <!-- table card -->
    <UCard class="xl:col-span-7">

      <!-- table header -->
      <div class="flex items-center justify-between gap-4 pb-4 border-b border-default/60">
        <UInput v-model="globalFilter" class="max-w-sm" placeholder="Search..." icon="i-lucide-search"/>

        <div class="flex gap-4">
          <UButton label="Refresh" color="primary" trailing-icon="i-lucide-refresh-cw"/>
          <UButton label="New" color="primary" trailing-icon="i-lucide-plus"/>
        </div>
      </div>
      <!-- /table header -->

      <!-- table -->
      <UTable
        :data="paginatedTableData"
        :columns="tableColumns"
        loading
        loading-color="primary"
        loading-animation="carousel"
        v-model:global-filter="globalFilter"
        class="flex-1 orders-table">
        <template #actions-cell="{ row }">
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="xs"
            aria-label="Edit row"/>
        </template>
      </UTable>
      <!-- /table -->

      <!-- pagination -->
      <div class="flex items-center justify-end pt-4">
        <UPagination
          v-model:page="tablePage"
          :items-per-page="tablePageSize"
          :total="orders.length"
          color="primary"
          variant="subtle"
          active-variant="solid"
        />
      </div>
      <!-- /pagination -->
    </UCard>
    <!-- /table card -->


    <!-- charts + summaries card -->
    <div class="xl:col-span-5 grid grid-cols-1 gap-4">
      <!-- summaries -->
      <UCard class="p-4 bg-purple-600 text-white">
        <div class="flex items-center">
          <div>
            <p class="mt-1 text-2xl font-semibold">
              {{ chartData[chartData.length - 1].sales.toLocaleString() }}
            </p>
            <p class="text-xs font-medium uppercase tracking-wide">Total sales this month</p>
          </div>

          <USeparator
            orientation="vertical"
            class="mx-6 h-12 bg-white/40"/>

          <div>
            <p class="mt-1 text-2xl font-semibold">
              {{ chartData[chartData.length - 1].profit.toLocaleString() }}
            </p>
            <p class="text-xs font-medium uppercase tracking-wide">Total profit this month</p>
          </div>
        </div>
      </UCard>
      <!-- /summaries -->

      <!-- line chart card -->
      <UCard class="p-3">
        <ClientOnly>
          <LineChart
            :categories="categories"
            :data="chartData"
            :xFormatter="xFormatter"
            :height="260"
            curveType="monotoneX"
            :lineWidth="3"
            :markerConfig="markerConfig"
            xGridLine
            yGridLine
            xTickLine
            yTickLine
            :tooltip="{ followCursor: true }"
            :duration="400"
            xLabel="Month"
            yLabel="Amount"
          />
        </ClientOnly>
      </UCard>
      <!-- /line chart card -->
    </div>
    <!-- /charts + summaries card -->


  </div>
  <!-- /main grid -->


  <!-- chat box -->
  <UDrawer direction="right">

    <template #content>
      <div class="flex min-h-full flex-col">

        <!-- Chat header -->
        <div class="mb-3 p-4 pr-6 flex items-center justify-between gap-3 border-b border-default/60 bg-default">

          <div class="flex gap-3 items-center">
            <UAvatar alt="Assistant avatar"
                     class="bg-purple-100 text-purple-600"
                     icon="i-lucide-bot"
                     size="lg"/>
            <h3 class="font-semibold tracking-tight text-purple-600 uppercase">Ventt assistant</h3></div>

          <UButton icon="i-lucide-x"
                   color="primary"
                   variant="ghost"
                   aria-label="Close chat"
                   @click="drawerOpen = false"/>
        </div>
        <!-- /Chat header -->


        <!-- messages -->
        <div class="p-4 pr-8">
          <div v-for="chat in chats" :key="chat.id">
            <div class="p-3 flex gap-2 items-center border border-default/60 bg-default/40">
              <UAvatar alt="Assistant avatar"
                       class="bg-purple-100 text-purple-600"
                       icon="i-lucide-user"
                       size="lg"/>
              <p>{{ chat.user }}</p>
            </div>

            <div v-if="chat.bot" class="my-4 flex gap-2">
              <p class="text-purple-700">{{ chat.bot }}</p>
              <UAvatar alt="Assistant avatar"
                       class="bg-purple-100 text-purple-600"
                       icon="i-lucide-bot"
                       size="lg"/>
            </div>

            <!-- AI Chat progress box -->
            <div v-else class="mt-4 flex items-center gap-4 rounded-lg border border-default/60 bg-default/40 p-4">
              <USkeleton class="h-10 w-10 rounded-full"/>

              <div class="grid gap-2">
                <USkeleton class="h-4 w-[250px]"/>
                <USkeleton class="h-4 w-[200px]"/>
              </div>
            </div>
            <!-- /AI Chat progress box -->

          </div>
        </div>
        <!-- /messages -->


        <!-- user query box -->
        <div v-if="!chat_submitted" class="p-4 pr-8 space-y-4">
          <!-- User Chat textbox -->
          <UTextarea class="w-full" placeholder="Type your message…" v-model="user_message"/>

          <!-- User chat submit -->
          <div class="text-right">
            <UButton icon="i-lucide-send" @click="addChat()" :disabled="!user_message"/>
          </div>
          <!-- /User chat submit -->
        </div>
        <!-- /user query box -->


      </div>
    </template>

  </UDrawer>
  <!-- /chat box -->

</template>


<script setup lang="js">
useHeadSafe({
  title: "Nuxt 4"
});
</script>


<script lang="js">
import { CalendarDate } from '@internationalized/date';

export default defineComponent({

  name: "index",

  data() {
    return {
      //calendar.
      calendar_value: new CalendarDate(2024, 3, 11),

      //messaging | notifications.
      notifications: [
        {id: 'n1', title: 'Server deploy completed', time: '3 mins ago'},
        {id: 'n2', title: 'New signup from Jane Doe', time: '12 mins ago'},
        {id: 'n3', title: 'Payment received', time: '30 mins ago'},
        {id: 'n4', title: 'Weekly report is ready', time: '1 hr ago'}
      ],
      messages     : [
        {id: 'm1', preview: '“Can we review Q2 targets?”', meta: 'Jean • 5 mins ago'},
        {id: 'm2', preview: '“Dashboard looks great!”', meta: 'Maria • 18 mins ago'},
        {id: 'm3', preview: '“Need access to reports”', meta: 'Chris • 42 mins ago'},
        {id: 'm4', preview: '“Share the latest export?”', meta: 'Robin • 2 hrs ago'}
      ],

      //table.
      tablePageSize: 5,
      tablePage    : 1,
      globalFilter : '',



      //chart categories.
      categories: {
        sales : {name: 'Sales', color: '#3b82f6'},
        profit: {name: 'Profit', color: '#10b981'}
      }
    }
  },

  computed: {

    paginatedTableData() {
      {
        const start = (this.tablePage - 1) * this.tablePageSize;
        return this.orders.slice(start, start + this.tablePageSize);
      }
    },

    tableColumns() {
      return [
        {accessorKey: 'order_id', header: 'Order ID'},
        {accessorKey: 'date', header: 'Date'},
        {accessorKey: 'customer_id', header: 'Customer ID'},
        {accessorKey: 'status', header: 'Status'},
        {accessorKey: 'amount', header: 'Amount'},
        {accessorKey: 'actions', header: ''}
      ]
    },


    //charts.
    RevenueCategoriesMultiple() {
      return {
        desktop: {name: 'Desktop', color: '#3b82f6'},
        mobile : {name: 'Mobile', color: '#22c55e'}
      }
    },

    RevenueData() {
      return [
        {month: 'january', desktop: 186, mobile: 80},
        {month: 'february', desktop: 305, mobile: 200},
        {month: 'march', desktop: 237, mobile: 120},
        {month: 'april', desktop: 73, mobile: 190},
        {month: 'may', desktop: 209, mobile: 130},
        {month: 'jun', desktop: 214, mobile: 140}
      ]
    },

    chartData() {
      return [
        {month: 'Jan', sales: 100, profit: 50},
        {month: 'Feb', sales: 120, profit: 55},
        {month: 'Mar', sales: 180, profit: 80},
        {month: 'Apr', sales: 110, profit: 40},
        {month: 'May', sales: 90, profit: 30},
      ]
    },

    markerConfig() {
      return {
        sales : { size: 6 },
        profit: { size: 6 }
      }
    },

    orders() {
      return [
        {
          order_id   : '4600',
          date       : '2024-03-11T15:30:00',
          customer_id: 'james.anderson@example.com',
          amount     : 594,
          status     : 'paid'
        },
        {
          order_id   : '4599',
          date       : '2024-03-11T10:10:00',
          customer_id: 'mia.white@example.com',
          amount     : 276,
          status     : 'failed'
        },
        {
          order_id   : '4598',
          date       : '2024-03-11T08:50:00',
          customer_id: 'william.brown@example.com',
          amount     : 315,
          status     : 'refunded'
        },
        {
          order_id   : '4597',
          date       : '2024-03-10T19:45:00',
          customer_id: 'emma.davis@example.com',
          amount     : 529,
          status     : 'paid'
        },
        {
          order_id   : '4596',
          date       : '2024-03-10T15:55:00',
          customer_id: 'ethan.harris@example.com',
          amount     : 639,
          status     : 'paid'
        }
      ]
    }

  },

  methods: {
    xFormatter(i) {
      return this.chartData[i].month;
    }

  },

  mounted() {

  }

})
</script>


<style scoped>
:deep(.orders-table tbody tr) {
  cursor: pointer;
}

:deep(.orders-table tbody tr:nth-child(even)) {
  background-color: rgba(148, 163, 184, 0.08); /* subtle stripe */
}

:deep(.orders-table tbody tr:hover) {
  color: rgb(147 51 234) !important; /* purple-600 */
  background-color: rgb(229 231 235); /* light gray */
}
</style>




