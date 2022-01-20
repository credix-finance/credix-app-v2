import { render } from '@testing-library/react'
import Home from '../src/pages/index'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);
  })
})
