<template>
   <transition name="modal">
      <div class="modal-mask">
         <div class="modal-wrapper">
            <div class="modal-container">

               <div class="modal-header">
                  <slot name="header"></slot>
                  <img src="../assets/icons/icon-close-128.png" 
                     alt="close button" class="close-button" 
                     v-on:click="$emit('close')">
               </div>

               <div class="modal-image">
                  <slot name="image"></slot>
               </div>

               <div class="modal-footer">
                  <slot name="footer">
                  </slot>
               </div>

            </div>
         </div>
      </div>
   </transition>
</template>

<style>
   .modal-mask {
      position: fixed;
      z-index: 2;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
      display: table;
      transition: opacity .3s ease;
   }

   .modal-wrapper {
      display: table-cell;
      vertical-align: middle;
   }

   .modal-container {
      max-width: 55vw;
      margin: 0px auto;
      padding: 20px 30px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      transition: all .3s ease;
      font-family: Helvetica, Arial, sans-serif;
   }
   .modal-image {
      max-height: 75vh;
      max-width: 100vw;
      overflow: scroll;
   }
   .close-button {
      width: 28px;
      float: right;
   }
   .modal-header {
      text-align: center;
   }
   .modal-header h3 {
      color: #42b983;
      display: inline;
   }
   .modal-body {
      margin: 20px 0;
   }

   .modal-default-button {
      float: right;
   }

   /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

   .modal-enter {
      opacity: 0;
   }

   .modal-leave-active {
      opacity: 0;
   }

   .modal-enter .modal-container,
   .modal-leave-active .modal-container {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
   }

</style>