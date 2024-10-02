<script>
    // ...
</script>

<div class="wrapper">
    <slot></slot>
</div>

<style lang="scss">
    @property --border-gradient-angle {
        syntax: "<angle>";
        inherits: true;
        initial-value: 0turn;
    }

    @keyframes buttonBorderSpin {
        0% {
            --border-gradient-angle: 0turn;
        }
        to {
            --border-gradient-angle: 1turn;
        }
    }

    .wrapper {
        padding: 1px;
        display: inline-block;
        border-radius: 0.2rem;
        transition: border 0.2s ease-in-out;

        &:hover {
            animation: buttonBorderSpin 1.2s cubic-bezier(0.52, 0.2, 0.43, 1) forwards;
            background-image: conic-gradient(
                from var(--border-gradient-angle) at -10% 100%,
                transparent,
                transparent 20%,
                var(--pico-primary-background)
            );
        }
    }
</style>
