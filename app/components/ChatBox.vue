<template>
  <!-- chat box -->
  <UDrawer
    v-model:open="drawerOpen"
    direction="right">

    <!-- chat toggle -->
    <UButton
      color="primary"
      label="Help"
      trailing-icon="i-lucide-message-circle-more"
      variant="subtle"
      @click="drawerOpen = true; showToast('Notice', 'this chat will be recorded')"
    />

    <template #content>
      <div class="flex min-h-full flex-col">

        <!-- Chat header -->
        <div class="mb-3 p-4 pr-8 flex items-center justify-between gap-3 border-b border-default/60 bg-default/90 backdrop-blur-sm">

          <div class="flex gap-3 items-center">
            <UAvatar
              alt="Assistant avatar"
              class="bg-purple-100 text-purple-600"
              icon="i-lucide-bot"
              size="lg"
            />
            <h3 class="font-semibold tracking-tight text-purple-600 uppercase">
              Ventt assistant
            </h3>
          </div>

          <UButton icon="i-lucide-x"
                   color="primary"
                   variant="ghost"
                   aria-label="Close chat"
                   @click="drawerOpen = false"/>
        </div>
        <!-- /Chat header -->


        <!-- messages -->
        <div class="p-4 pr-8 space-y-4 chat-scroll">
          <div v-for="chat in chats" :key="chat.id">
            <div class="p-3 flex gap-2 items-center border border-default/60 bg-default/60 rounded-2xl shadow-sm">
              <UAvatar
                alt="User avatar"
                class="bg-default text-purple-600"
                icon="i-lucide-user"
                size="lg"
              />
              <p class="text-sm text-highlighted">
                {{ chat.user }}
              </p>
            </div>

            <div
              v-if="chat.bot"
              class="my-4 flex gap-2 items-start justify-end"
            >
              <p class="px-3 py-2 rounded-2xl bg-purple-50 text-purple-800 text-sm max-w-[70%]">
                {{ chat.bot }}
              </p>
              <UAvatar
                alt="Assistant avatar"
                class="bg-purple-100 text-purple-600"
                icon="i-lucide-bot"
                size="lg"
              />
            </div>

            <!-- AI Chat progress box -->
            <div
              v-else
              class="mt-4 flex items-center gap-4 rounded-2xl border border-primary/40 bg-primary/5 p-4 thinking-box"
            >
              <USkeleton class="h-10 w-10 rounded-full"/>

              <div class="grid gap-2">
                <p class="text-xs font-medium uppercase tracking-wide text-primary-500">
                  One moment…
                </p>
                <USkeleton class="h-3 w-[220px]"/>
                <USkeleton class="h-3 w-[180px]"/>
              </div>
            </div>
            <!-- /AI Chat progress box -->

          </div>
        </div>
        <!-- /messages -->


        <!-- user query box -->
        <div
          v-if="!chat_submitted"
          class="p-4 pr-8 space-y-4 border-t border-default/60 bg-default/70 backdrop-blur-sm"
        >
          <!-- User Chat textbox -->
          <UTextarea
            class="w-full"
            placeholder="Type your message…"
            v-model="user_message"
          />

          <!-- User chat submit -->
          <div class="flex items-center justify-end">
            <UButton
              icon="i-lucide-send"
              label="Send"
              color="primary"
              :disabled="!user_message"
              @click="addChat()"
            />
          </div>
          <!-- /User chat submit -->
        </div>
        <!-- /user query box -->


      </div>
    </template>

  </UDrawer>
  <!-- /chat box -->
</template>


<script lang="js">
export default defineComponent({
  setup() {
    const toast = useToast();
    return {toast};
  },

  data() {
    return {
      name: "ChatBox",
      //chat.
      chat          : null,
      user_message  : null,
      chats         : [
        {user: "Do you offer shipping?", bot: "Yes, we offer shipping for areas within 30km", time: new Date().getTime()},
        {user: "Do you offer discount on bulk?", bot: "Yes, we offer discounts from 2000. Contact support for more details.", time: new Date().getTime()},
      ],
      drawerOpen    : false,
      chat_submitted: false,

    }
  },

  methods: {
    //add new chat.
    async addChat() {
      //validate.
      if (!this.user_message) return;

      this.chat = {id: new Date().getTime(), user: this.user_message, date: new Date().getTime()};
      //update UI.
      this.chat_submitted = true;

      //post enquiry.
      const response = await $fetch('/chat', {
        method: "POST",
        body  : {
          messages: this.chat.user
        }
      });

      //validate
      if (!response || response.error) this.showToast('Error', 'Unable to send your enquiry.');

      //add message.
      this.chat.bot = response.message;
      this.chats.push(this.chat);

      //update UI.
      this.chat_submitted = false;
      this.user_message = '';
    },


    //notify.
    showToast(title, description, icon, progress) {
      this.toast.add({
        title      : title || "Notice",
        description: description || "This chat will be recorded.",
        icon       : icon || "i-lucide-message-circle-more",
        progress   : progress || false
      });
    }

  }
})
</script>


<style scoped>
.chat-scroll {
  max-height: 65vh;
  overflow-y: auto;
}

.thinking-box {
  animation: thinking-pulse 1.4s ease-in-out infinite;
}

@keyframes thinking-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
</style>
