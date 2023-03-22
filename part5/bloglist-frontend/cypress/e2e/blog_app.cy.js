describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Chris Chan',
      username: 'qachris',
      password: 'blogtest'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
  })

  it('Login form is shown', function() {
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('qachris')
      cy.get('#password').type('blogtest')
      cy.contains('login').click()

      cy.contains('Chris Chan logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('qachris')
      cy.get('#password').type('wrong')
      cy.contains('login').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.contains('Chris Chan logged in').should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('qachris')
      cy.get('#password').type('blogtest')
      cy.contains('login').click()
    })

    it('A blog can be created', function() {
      cy.contains('create a new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('James Yee')
      cy.get('#url').type('http://jsyee.com')
      cy.get('#create-button').click()
      cy.contains('a blog created by cypress')
    })

    describe('and serveral blogs exist', function() {
      beforeEach(function () {
        cy.login({ username: 'qachris', password: 'blogtest' })
        cy.createBlog({
          title: 'Game Playing sites for 2020',
          author: 'Harry M',
          url: 'http://hrrg.com'
        })
        cy.createBlog({
          title: 'Chat GPT in action',
          author: 'Watson Wang',
          url: 'http://watsonw.com'
        })
        cy.createBlog({
          title: 'Programming techniques in WEB',
          author: 'Harry Joe',
          url: 'http://haryjoe.com'
        })
      })
      it('user can click like for the blog', function() {
        cy.get('#username').type('qachris')
        cy.get('#password').type('blogtest')
        cy.contains('login').click()

        cy.contains('Chat GPT in action')
          .contains('view')
          .click()

        cy.contains('Chat GPT in action').parent().find('button').as('theButton')
        cy.contains('likes 0')
        cy.get('@theButton').then( buttons => {
          console.log('number of buttons', buttons.length)
          cy.wrap(buttons[1]).click()
        })
        cy.contains('likes 1')
      })

      it('user who creates the blog can delete it', function() {
        cy.get('#username').type('qachris')
        cy.get('#password').type('blogtest')
        cy.contains('login').click()

        cy.contains('Programming techniques in WEB')
          .contains('view')
          .click()

        cy.contains('Programming techniques in WEB').parent().find('button').as('theButton')
        cy.get('@theButton').should('contain', 'remove')

        cy.get('@theButton').then( buttons => {
          console.log('number of buttons', buttons.length)
          cy.wrap(buttons[2]).click()
        })
        cy.get('html').should('not.contain', 'Programming techniques in WEB')
      })

      it('only user who creates the blog can delete the blog, not anyone else', function() {
        const user = {
          name: 'Dummy Chan',
          username: 'chris',
          password: 'dmytest'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)

        cy.get('#username').type('chris')
        cy.get('#password').type('dmytest')
        cy.contains('login').click()

        cy.contains('Programming techniques in WEB')
          .contains('view')
          .click()

        cy.contains('Programming techniques in WEB').parent().find('button').as('theButton')
        cy.get('@theButton').should('not.contain', 'remove')
      })

      it('blogs are ordered according to the most likes, being the first', function() {
        cy.get('#username').type('qachris')
        cy.get('#password').type('blogtest')
        cy.contains('login').click()

        cy.contains('Chat GPT in action')
          .contains('view')
          .click()

        cy.contains('Chat GPT in action').parent().find('button').as('theButton1')

        cy.get('@theButton1').then( buttons => {
          console.log('number of buttons', buttons.length)
          cy.wrap(buttons[1]).click()
          cy.wrap(buttons[1]).click()
          cy.wrap(buttons[1]).click()
          cy.wrap(buttons[1]).click()
          cy.wrap(buttons[1]).click()
        })

        cy.contains('Game Playing sites for 2020')
          .contains('view')
          .click()

        cy.contains('Game Playing sites for 2020').parent().find('button').as('theButton2')
        cy.get('@theButton2').then( buttons => {
          console.log('number of buttons', buttons.length)
          cy.wrap(buttons[1]).click()
          cy.wrap(buttons[1]).click()
          cy.wrap(buttons[1]).click()
        })

        cy.contains('Programming techniques in WEB')
          .contains('view')
          .click()

        cy.get('.blog').eq(0).should('contain', 'Chat GPT in action')
        cy.get('.blog').eq(1).should('contain', 'Game Playing sites for 2020')
        cy.get('.blog').eq(2).should('contain', 'Programming techniques in WEB')

      })
    })
  })
})
