<template>
  <div class="lottery-app">
    <!-- winners Block -->
    <div class="card">
      <div class="d-flex">
        <div class="winner-tags gray-border">
          <span
            v-for="(winner, index) in winners"
            :key="index"
            class="badge blue"
          >
            {{ winner.name }}
            <button @click="removeWinner(index)" class="btn btn-sm btn-danger">
              &times;
            </button>
          </span>
          <span class="badge">Winners</span>
        </div>
      </div>
      <button
        class="btn btn-primary mt-2"
        :disabled="winners.length >= 3 || participants.length === 0"
        @click="selectWinner"
      >
        New winner
      </button>
    </div>

    <!-- registration Form -->
    <div class="card">
      <h3>REGISTER FORM</h3>
      <p>Please fill in all the fields.</p>
      <form @submit.prevent="registerParticipant" novalidate>
        <div class="form-group">
          <label>Name</label>
          <input
            v-model="newParticipant.name"
            type="text"
            class="form-control"
            placeholder="Enter user name"
            :class="{ 'is-invalid': nameError }"
            required
          />
          <!-- повідомлення про помилку якщо nameError не пустий -->
          <div class="text-danger" v-if="nameError">{{ nameError }}</div>
        </div>
        <div class="form-group">
          <label>Date of Birth</label>
          <input
            v-model="newParticipant.dateOfBirth"
            type="date"
            class="form-control"
            :max="today"
            :class="{ 'is-invalid': dateError }"
            required
          />
          <!-- повідомлення про помилку якщо dateError не пустий -->
          <div class="text-danger" v-if="dateError">{{ dateError }}</div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="newParticipant.email"
            type="email"
            class="form-control"
            placeholder="Enter email"
            :class="{ 'is-invalid': emailError }"
            required
          />
          <!-- повідомлення про помилку якщо emailError не пустий -->
          <div class="text-danger" v-if="emailError">{{ emailError }}</div>
        </div>
        <div class="form-group">
          <label>Phone number</label>
          <input
            v-model="newParticipant.phoneNumber"
            type="tel"
            class="form-control"
            placeholder="Enter phone number"
            :class="{ 'is-invalid': phoneError }"
            required
          />
          <!-- повідомлення про помилку якщо phoneError не пустий -->
          <div class="text-danger" v-if="phoneError">{{ phoneError }}</div>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    </div>

    <!-- participants table -->
    <div class="card">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Delete Participant</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(participant, index) in participants" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ participant.name }}</td>
            <td>{{ participant.dateOfBirth }}</td>
            <td>{{ participant.email }}</td>
            <td>{{ participant.phoneNumber }}</td>
            <!-- кнопка для видалення учасника -->
            <td class="d-flex justify-content-center align-items-center">
              <!-- викликається метод для підтвердження видалення -->
              <button
                @click="confirmRemoveParticipant(index)"
                class="btn btn-danger btn-sm"
              >
                &times;
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- модальне підтвердження -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h4>Confirm Deletion</h4>
        <p>Are you sure you want to delete this participant?</p>
        <div class="button-container">
          <!-- контейнер для кнопок -->
          <button @click="deleteParticipant" class="btn btn-danger">
            Delete
          </button>
          <button @click="cancelDeletion" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Validator } from "@/misc/Validator";
import type { Participant } from "@/models/Participant";

export default defineComponent({
  name: "LotteryApp",
  setup() {
    //отримуємо сьогоднішню дату в форматі YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];
    //стан для нового учасника
    const newParticipant = ref<Participant>({
      name: "",
      dateOfBirth: "",
      email: "",
      phoneNumber: "",
    });
    //стан для списків учасників та переможців
    const participants = ref<Participant[]>([]);
    const winners = ref<Participant[]>([]);
    //стан для повідомлень про помилки валидації
    const nameError = ref("");
    const dateError = ref("");
    const emailError = ref("");
    const phoneError = ref("");
    //стан для модального вікна підтвердження видалення
    const showModal = ref(false);
    const participantToDelete = ref<number | null>(null); // зберігає індекс учасника, якого потрібно видалити

    //завантажуємо учасників з localStorage при монтуванні компонента
    onMounted(() => {
      const storedParticipants = localStorage.getItem("participants");
      if (storedParticipants) {
        participants.value = JSON.parse(storedParticipants);
      }
    });

    //функція для підтвердження видалення учасника
    const confirmRemoveParticipant = (index: number) => {
      participantToDelete.value = index;
      showModal.value = true;
    };

    //функція для видалення учасника
    const deleteParticipant = () => {
      if (participantToDelete.value !== null) {
        participants.value.splice(participantToDelete.value, 1);
        participantToDelete.value = null;
        showModal.value = false;
        saveParticipantsToLocalStorage();
      }
    };

    //функція для скасування видалення
    const cancelDeletion = () => {
      showModal.value = false;
      participantToDelete.value = null;
    };

    //функція для збереження учасників в localStorage
    const saveParticipantsToLocalStorage = () => {
      localStorage.setItem("participants", JSON.stringify(participants.value));
    };

    //функція для реєстрації нового учасника
    const registerParticipant = () => {
      //валідація полів
      nameError.value = Validator.validateName(newParticipant.value.name);
      dateError.value = Validator.validateDateOfBirth(
        newParticipant.value.dateOfBirth,
        today
      );
      emailError.value = Validator.validateEmail(newParticipant.value.email);
      phoneError.value = Validator.validatePhoneNumber(
        newParticipant.value.phoneNumber
      );

      //якщо є помилки, виходимо з функції
      if (
        nameError.value ||
        dateError.value ||
        emailError.value ||
        phoneError.value
      ) {
        return;
      }

      //додаємо нового учасника в список
      participants.value.push({ ...newParticipant.value });
      //очищаємо поля вводу
      newParticipant.value.name = "";
      newParticipant.value.dateOfBirth = "";
      newParticipant.value.email = "";
      newParticipant.value.phoneNumber = "";
      //зберігаємо оновлений список в localStorage
      saveParticipantsToLocalStorage();
    };

    //функція для вибору переможця
    const selectWinner = () => {
      if (participants.value.length > 0 && winners.value.length < 3) {
        const randomIndex = Math.floor(
          Math.random() * participants.value.length
        );
        const winner = participants.value[randomIndex];
        winners.value.push(winner); //додаємо переможця в список переможців
        participants.value.splice(randomIndex, 1); //видаляємо переможця з списку учасників

        //зберігаємо оновлений список в localStorage
        saveParticipantsToLocalStorage();
      }
    };

    //функція для видалення переможця
    const removeWinner = (index: number) => {
      participants.value.push(winners.value[index]);
      winners.value.splice(index, 1);

      //зберігаємо оновлений список в localStorage
      saveParticipantsToLocalStorage();
    };

    return {
      newParticipant,
      participants,
      winners,
      nameError,
      dateError,
      emailError,
      phoneError,
      today,
      showModal,
      confirmRemoveParticipant,
      deleteParticipant,
      cancelDeletion,
      registerParticipant,
      selectWinner,
      removeWinner,
    };
  },
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
}

.modal-content button {
  width: 120px;
  margin: 0 5px;
}

.modal-content .button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.lottery-app {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
  padding: 3%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.d-flex {
  display: flex;
  flex-direction: column;
}

.winner-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.winner-tags .badge {
  display: flex;
  color: black;
  height: 35px;
  align-items: center;
  gap: 5px;
  padding: 10px;
  font-size: 1rem;
}

.blue {
  background-color: rgba(13, 110, 253, 0.5);
}

.winner-tags button {
  margin-left: 2px;
  margin-top: 1px;
}

.gray-border {
  border: solid gray 1px;
  border-radius: 10px;
  padding: 10px;
}

form div {
  margin-bottom: 10px;
}

.text-danger {
  color: red;
  font-size: 0.875rem;
}

table {
  width: 100%;
}

thead {
  background-color: #e9ecef;
}

th,
td {
  padding: 8px;
  text-align: center;
}

button {
  margin-top: 10px;
}
</style>
