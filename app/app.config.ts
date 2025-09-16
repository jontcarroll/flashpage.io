export default defineAppConfig({
  ui: {
    colors: {
      primary: 'yellow',
      neutral: 'gray'
    },
    button: {
      base: 'font-black uppercase tracking-wider brutal-transition',
      rounded: 'rounded-none',
      default: {
        color: 'border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] active:shadow-[4px_4px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px]'
      }
    },
    card: {
      base: 'border-4 border-black shadow-[8px_8px_0px_#000000]',
      rounded: 'rounded-none',
      header: {
        base: 'border-b-4 border-black'
      }
    },
    input: {
      base: 'font-mono font-bold',
      rounded: 'rounded-none',
      default: {
        base: 'border-4 border-black focus:shadow-[8px_8px_0px_#0066FF]'
      }
    }
  }
})
