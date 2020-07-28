import { shallowMount } from '@vue/test-utils'
import Comment from '@/components/Comment.vue'

describe('Comment.vue', () => {
  it('renders props.msg when passed', () => {
    const commentData = {
      id: 1,
      userId: 1,
      text: 'Comment text',
      createdAt: '2020-07-27T18:58:02.809Z',
      updatedAt: '2020-07-27T18:58:02.809Z',
      user: {
        name: 'Pero'
      }
    }
    const wrapper = shallowMount(Comment, { propsData: {commentData} })
    expect(wrapper.text()).toContain(commentData.user.name)
    expect(wrapper.text()).toContain(commentData.text)
  })
})
