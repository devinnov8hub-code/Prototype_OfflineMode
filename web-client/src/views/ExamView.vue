<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useExamStore } from "../stores/examStore";
import { getAllAnswers } from "../offline/db";
import api from "../services/api";

const store = useExamStore();


const started = ref(false);
const timeLeft = ref(1800);
let timer:number|undefined;
const selected = ref<number|null>(null);


const showModal = ref(false);
const modalText = ref("");
const modalType = ref<"success"|"error"|"info">("info");

function openModal(text:string,type:"success"|"error"|"info"="info"){
  modalText.value=text;
  modalType.value=type;
  showModal.value=true;
}
function closeModal(){
  showModal.value=false;
}


onMounted(async ()=>{
  await store.loadQuestions();
});


const q = computed(()=> store.questions[store.currentIndex]);

const progress = computed(()=>{
  return store.questions.length
    ? ((store.currentIndex+1)/store.questions.length)*100
    : 0;
});


function startExam(){
  if(navigator.onLine){
    openModal("Turn OFF internet before starting exam","error");
    return;
  }
  started.value=true;
  startTimer();
}


function startTimer(){
  timer=setInterval(()=>{
    timeLeft.value--;

    if(timeLeft.value<=0){
      clearInterval(timer);
      openModal("Time is up! Connect internet to submit.","info");
    }
  },1000);
}

function formatTime(t:number){
  const m=Math.floor(t/60);
  const s=t%60;
  return m+":"+(s<10?"0"+s:s);
}


function pick(i:number){
  selected.value=i;
}


function next(){
  if(selected.value===null){
    openModal("Select an option first","error");
    return;
  }
  store.submitAnswer(selected.value);
  selected.value=null;
}


async function submitExam(){

  if(!navigator.onLine){
    openModal("Turn ON internet before submitting","error");
    return;
  }

  try{
    const answers = await getAllAnswers();

    if(!answers.length){
      openModal("No answers recorded","error");
      return;
    }

    clearInterval(timer);

    const res = await api.post("/answers/bulk", answers);

    if(res.status === 200 || res.status === 201){
      openModal("Submitted successfully! Good luck","success");

      setTimeout(()=>{
        location.reload();
      },2500);
    }

  }catch(e){
    console.error(e);
    openModal("Submission failed. Try again.","error");
  }
}
</script>

<template>
<div class="page">

  <div v-if="!started" class="start">
    <h1>Computer Based Test</h1>
    <p>Disconnect internet before starting.</p>
    <button @click="startExam">Start Exam</button>
  </div>

  <div v-else-if="q" class="exam">

    <div class="header">
      <div>
        Question {{store.currentIndex+1}} /
        {{store.questions.length}}
      </div>
      <div class="timer">
        {{formatTime(timeLeft)}}
      </div>
    </div>

    <div class="bar">
      <div class="fill" :style="{width:progress+'%'}"></div>
    </div>

    <div class="question">
      {{q.text}}
    </div>

    <div class="options">
      <button
        v-for="(o,i) in q.options"
        :key="i"
        @click="pick(i)"
        :class="{active:selected===i}"
      >
        {{o}}
      </button>
    </div>

    <div class="nav">
      <button @click="next">Next</button>
      <button @click="submitExam" class="submit">
        Submit
      </button>
    </div>

  </div>

  <div v-else class="finish">
    <h2>Exam Completed</h2>
    <button @click="submitExam">
      Submit Results
    </button>
  </div>

  <div v-if="showModal" class="modal-overlay">
    <div class="modal" :class="modalType">
      <p>{{modalText}}</p>
      <button @click="closeModal">OK</button>
    </div>
  </div>

</div>
</template>

<style scoped>
.page{
  min-height:100vh;
  background:#eef2f7;
  display:flex;
  justify-content:center;
  align-items:center;
  font-family:Arial;
}

.start{text-align:center;}

.start button{
  padding:14px 28px;
  background:#1e3a8a;
  color:white;
  border:none;
  border-radius:8px;
  cursor:pointer;
}

.exam{
  width:800px;
  background:white;
  padding:30px;
  border-radius:12px;
  box-shadow:0 10px 30px rgba(0,0,0,.1);
}

.header{
  display:flex;
  justify-content:space-between;
  font-weight:600;
}

.timer{color:#dc2626;}

.bar{
  height:8px;
  background:#ddd;
  border-radius:4px;
  margin:10px 0;
}

.fill{
  height:100%;
  background:#1e3a8a;
  border-radius:4px;
}

.question{
  font-size:20px;
  margin:20px 0;
}

.options{
  display:flex;
  flex-direction:column;
  gap:12px;
}

.options button{
  padding:14px;
  border:1px solid #ccc;
  border-radius:8px;
  background:white;
  cursor:pointer;
}

.options button.active{
  background:#1e3a8a;
  color:white;
}

.nav{
  display:flex;
  justify-content:space-between;
  margin-top:20px;
}

.submit{
  background:#16a34a;
  color:white;
}

.modal-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.4);
  display:flex;
  justify-content:center;
  align-items:center;
}

.modal{
  background:white;
  padding:30px;
  border-radius:12px;
  width:320px;
  text-align:center;
  box-shadow:0 10px 30px rgba(0,0,0,.2);
}

.modal button{
  padding:10px 20px;
  background:#1e3a8a;
  color:white;
  border:none;
  border-radius:6px;
}

.modal.success{ border-top:6px solid #16a34a; }
.modal.error{ border-top:6px solid #dc2626; }
.modal.info{ border-top:6px solid #2563eb; }
</style>
