<template>
    <div>
        <div
            v-if="device === devices.DEFAULT"
            class="flex flex-row fixed top-0 left-0 h-screen w-screen justify-end"
        >
            <div class="flex-grow relative">
                <Table class="absolute top-0 left-0 h-full w-full" />
                <Dice class="absolute top-0 left-0 h-full w-full" />
                <ZoomOverlay class="absolute bottom-0 right-0 "/>
            </div>
            <Overlay />
        </div>


        <Login v-if="device !== devices.TV" />

        <Settings v-if="device !== devices.TV" />

        <FullscreenNotification class="hidden" />

        <InitiativeTracker v-if="device !== devices.MOBILE" />

        <FloatingButtons v-if="device === devices.DEFAULT" />
        <FloatingInfos v-if="device === devices.DEFAULT" />

        <AddCharacter v-if="device === devices.DEFAULT" />
        <AddImage v-if="device === devices.DEFAULT" />
        <SelectBackgroundLayer v-if="device === devices.DEFAULT" />
        <AddPlayersToCharacter v-if="device === devices.DEFAULT" />
        <AddCharacterConditions v-if="device === devices.DEFAULT" />
        <ConsolePopup />
        <DicePopup />
        <MobileMovement v-if="device === devices.MOBILE" />
        <div
            v-show="visible"
            class="w-full h-full fixed top-0 left-0 bg-gray-700 flex justify-center items-center select-none"
            :class="{'animate__animated animate__fadeOutDown animate__fast' : fadeOut}"
        >
            <span class="font-10xl font-bold text-accent">t<img
                src="/icon-resized.png"
                class="inline-block h-auto w-16 -mt-6 mx-1"
                :class="{'mirrored' : mirrored}"
            >rch.ly</span>
        </div>
    </div>
</template>
<script>
import Table from "../components/Table";
import Overlay from "../components/overlay/Overlay";
import FloatingButtons from "../components/FloatingButtons";
import FloatingInfos from "../components/FloatingInfos";
import AddImage from "@/components/popups/AddImage";
import AddCharacter from "@/components/popups/AddCharacter";
import MobileMovement from "@/components/MobileMovement";
import Login from "@/components/popups/Login";
import SelectBackgroundLayer from "@/components/popups/SelectBackgroundLayer";
import devices from "@/enums/devices";
import InitiativeTracker from "@/components/overlay/InitiativeTracker";
import FullscreenNotification from "@/components/gui-components/FullscreenNotification";
import Settings from "@/components/settings/Settings";
import AddPlayersToCharacter from "@/components/popups/AddPlayersToCharacter";
import AddCharacterConditions from "@/components/popups/AddCharacterConditions";
import Dice from "@/components/Dice";
import ConsolePopup from "@/components/popups/ConsolePopup";
import DicePopup from "@/components/popups/DicePopup";
import ZoomOverlay from "@/components/overlay/ZoomOverlay";

export default {
	components: {
	 ZoomOverlay,
		DicePopup,
		ConsolePopup,
		Dice,
		AddCharacterConditions,
		AddPlayersToCharacter,
		Overlay,
		Table,
		FullscreenNotification,
		Settings,
		InitiativeTracker,
		FloatingButtons,
		FloatingInfos,
		AddImage,
		AddCharacter,
		MobileMovement,
		Login,
		SelectBackgroundLayer
	},
	data() {
		return {
			mirrored: false,
			fadeOut: false,
			visible: true,
			devices: devices,
		};
	},
	computed: {
		device() {
			return this.$store.state.config.device;
		}
	},
	mounted() {
		if (process.env.NODE_ENV === "development") {
			this.visible = false;
			return;
		}

		let self = this;
		let interval = setInterval(() => self.mirrored = !self.mirrored, 100);
		setTimeout(() => {
			self.fadeOut = true;
		}, 2000);
		setTimeout(() => {
			clearInterval(interval);
			self.visible = false;
		}, 2500);
	}
};
</script>
<style>
.font-10xl {
	font-size: 6rem;
}

.mirrored {
	-moz-transform: scaleX(-1); /* Gecko */
	-o-transform: scaleX(-1); /* Opera */
	-webkit-transform: scaleX(-1); /* Webkit */
	transform: scaleX(-1); /* Standard */

	filter: FlipH; /* IE 6/7/8 */
}

body {
	touch-action: manipulation;
}

</style>
