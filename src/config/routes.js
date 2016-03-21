import auth from '../utils/auth.js'
import App from '../app'
import Logout from '../pages/components/login/Logout'
import Login from '../pages/components/login/Login'
import Register from '../pages/components/login/Register'
import Products from '../pages/products/products'
import Product from '../pages/products/product'
import CategoryProduct from '../pages/products/category-product'
import Cart from '../pages/products/cart'
import CartToOrder from '../pages/products/components/cart-to-order'
import ConvenienceLife from '../pages/convenience-life'
import ArticleList from '../pages/article-list'
import EducationService from '../pages/education-service'
import InnovationSpace from '../pages/innovation-space'
import FinanceService from '../pages/finance-service'
import CompanyService from '../pages/company-service'
import About from '../pages/about'
import Article from '../pages/article'

function redirectToLogin(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  }
}

function redirectToDashboard(nextState, replace) {
  if (auth.loggedIn()) {
    replace('/')
  }
}

export default {
  component: App,
  childRoutes: [
    {
      path: '/logout',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, Logout)
        })
      }
    },

    {
      onEnter: redirectToDashboard,
      childRoutes: [
        // Unauthenticated routes
        // Redirect to dashboard if user is already logged in
        {
          path: '/login',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, Login)
            })
          }
        },
        {
          path: '/register',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, Register)
            })
          }
        }
      ]
    },

    {
      onEnter: redirectToLogin,
      childRoutes: [
        // Protected routes that don't share the dashboard UI
        {
          path: '/user/:id',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, User)
            })
          }
        }
        // ...
      ]
    },
    {
      path: '/products-by-category/:category',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, CategoryProduct)
        })
      }
    },
    {
      path: '/product/:id',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, Product)
        })
      }
    },
    {
      path: '/shopping-cart',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, Cart)
        })
      }
    },
    {
      path: '/shopping-cart-to-order',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, CartToOrder)
        })
      }
    },
    {
      path: '/convenience-life',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, ConvenienceLife)
        })
      },
      childRoutes: [
        {
          path: '/convenience-life/:title',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, ArticleList)
            })
          },
          childRoutes:[
            {
              path: '/convenience-life/:title/:category',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  cb(null, ArticleList)
                })
              }
            }
          ]
        }
      ]
    },
    {
      path: '/education-service',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, EducationService)
        })
      },
      childRoutes: [
        {
          path: '/education-service/:title/:category',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, ArticleList)
            })
          }
        }
      ]
    },
    {
      path: '/innovation-space',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, InnovationSpace)
        })
      },
      childRoutes: [
        {
          path: '/innovation-space/:title',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, ArticleList)
            })
          },
          childRoutes:[
            {
              path: '/innovation-space/:title/:category',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  cb(null, ArticleList)
                })
              }
            }
          ]
        }
      ]
    },
    {
      path: '/finance-service',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, FinanceService)
        })
      },
      childRoutes: [
        {
          path: '/finance-service/:title',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, ArticleList)
            })
          },
          childRoutes:[
            {
              path: '/finance-service/:title/:category',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  cb(null, ArticleList)
                })
              }
            }
          ]
        }
      ]
    },
    {
      path: '/company-service',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, CompanyService)
        })
      },
      childRoutes: [
        {
          path: '/company-service/:title',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
              cb(null, ArticleList)
            })
          },
          childRoutes:[
            {
              path: '/company-service/:title/:category',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  cb(null, ArticleList)
                })
              }
            }
          ]
        }
      ]
    },
    {
      path: '/about',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, About)
        })
      }
    },
    {
      path: '/search/:searchValue',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, ArticleList)
        })
      }
    },
    {
      path: '/article/:title/:id',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, Article)
        })
      }
    }
    ,
    {
      path: '/',
      getComponent: (location, cb) => {
        // Share the path
        // Dynamically load the correct component
        if (auth.loggedIn()) {
          return require.ensure([], (require) => {
            cb(null, Products)
          })
        }
        return require.ensure([], (require) => {
          cb(null, Products)
        })
      },
      indexRoute: {
        getComponent: (location, cb) => {
          // Only load if we're logged in
          if (auth.loggedIn()) {
            return require.ensure([], (require) => {
              cb(null, Products)
            })
          }
          return cb()
        }
      },
      childRoutes: [
        {
          onEnter: redirectToLogin,
          childRoutes: [
            {

            }

          ]
        }
      ]
    }

  ]
}