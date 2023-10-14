import { describe, test, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import { mount } from '@vue/test-utils'
import Index from './index.vue'

import SrText from 'sr-content/components/Text.vue'
import SrContainer from 'sr-content/components/Container.vue'
import SrImg from 'sr-content/components/Img/index.vue'



describe('Home Page Render Test', async () => {
    await setup({

    })

    test('Site under construction', () => {
        SrText.editable = false;
        const wrapper = mount(Index, { components: { SrText, SrContainer, SrImg } });
        const text = wrapper.find('.sr-text');
        expect(text.text()).toContain("Sitio en construcción");
    })
})
