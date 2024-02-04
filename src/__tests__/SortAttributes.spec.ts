import SortAttributes from '@/SortAttributes';

describe('SortAttributes.customSort', () => {
  it('should return the array in the order maps but then alphabetised', () => {
    const input = ['description', 'operationId', 'summary', 'tags', 'requestBody', 'security', 'x-passRequest', 'responses'];
    const map = ['summary', 'description', 'operationId', 'tags', 'security'];
    const final = SortAttributes.customSort(input, map);
    const expectedOrder = ['summary', 'description', 'operationId', 'tags', 'security', 'requestBody', 'responses', 'x-passRequest'];
    expect(final).toEqual(expectedOrder);
  });

  it('change the order and it should still pass', () => {
    const input = ['description', 'operationId', 'summary', 'tags', 'requestBody', 'security', 'x-passRequest', 'responses'];
    const map = ['operationId', 'summary', 'description', 'tags', 'security'];
    const final = SortAttributes.customSort(input, map);
    const expectedOrder = ['operationId', 'summary', 'description', 'tags', 'security', 'requestBody', 'responses', 'x-passRequest'];
    expect(final).toEqual(expectedOrder);
  });

  it('remove elements from the input and it should retain order but minus the removed items', () => {
    const input = ['operationId', 'summary', 'tags', 'requestBody', 'x-passRequest', 'responses'];
    const map = ['operationId', 'summary', 'description', 'tags', 'security'];
    const final = SortAttributes.customSort(input, map);
    const expectedOrder = ['operationId', 'summary', 'tags', 'requestBody', 'responses', 'x-passRequest'];
    expect(final).toEqual(expectedOrder);
  });
});

describe('SortAttributes.orderObjectAttributes', () => {

  it('should order attributes based on the input array', () => {
    const inputArray = ['name', 'age', 'gender'];
    const inputObject = {
      age: 25,
      name: 'John Doe',
      gender: 'male',
      hobby: 'football'
    };
    const expectedOutput = {
      name: 'John Doe',
      age: 25,
      gender: 'male'
    };
    expect(SortAttributes.orderObjectAttributes(inputArray, inputObject)).toEqual(expectedOutput);
  });

  it('should handle empty inputArray and return an empty object', () => {
    const inputArray: any[] = [];
    const inputObject = {
      name: 'Jane Doe',
      age: 30
    };
    expect(SortAttributes.orderObjectAttributes(inputArray, inputObject)).toEqual({});
  });

  it('should handle attributes in inputArray that are not in inputObject', () => {
    const inputArray = ['name', 'age', 'height'];
    const inputObject = {
      age: 30,
      name: 'Jane Doe'
    };
    const expectedOutput = {
      name: 'Jane Doe',
      age: 30,
      // @ts-ignore
      height: undefined
    };
    expect(SortAttributes.orderObjectAttributes(inputArray, inputObject)).toEqual(expectedOutput);
  });

  it('should return an empty object if inputObject is empty', () => {
    const inputArray = ['name', 'age'];
    const inputObject = {};
    expect(SortAttributes.orderObjectAttributes(inputArray, inputObject)).toEqual({});
  });

  it('should ignore extra attributes in inputObject that are not in inputArray', () => {
    const inputArray = ['name', 'age'];
    const inputObject = {
      name: 'Jane Doe',
      age: 30,
      gender: 'female'
    };
    const expectedOutput = {
      name: 'Jane Doe',
      age: 30
    };
    expect(SortAttributes.orderObjectAttributes(inputArray, inputObject)).toEqual(expectedOutput);
  });

  it('should handle null or undefined inputObject gracefully', () => {
    const inputArray = ['name', 'age'];
    expect(SortAttributes.orderObjectAttributes(inputArray, null)).toEqual({});
    expect(SortAttributes.orderObjectAttributes(inputArray, undefined)).toEqual({});
    expect(SortAttributes.orderObjectAttributes(inputArray, 'bob')).toEqual({});
  });
});

describe('openapi & asyncapi sorting', () => {
  it('openapi', () => {
    const input: any = {
      'openapi': '3.0.0',
      'info': {
        'version': '0.0.1',
        'title': 'backend-swagger',
        'description': 'backend swagger',
        'license': {
          'name': 'Apache 2.0',
          'url': 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
      },

      'paths': {
        '/_internal/fetch-user-based-on-jwt': {
          'post': {
            'requestBody': {
              'required': true,
              'content': {
                'application/json': {
                  'schema': {
                    '$ref': '#/components/schemas/InternalFetchUserBasedOnJwtPost'
                  }
                }
              }
            },
            'responses': {
              '200': {
                'description': 'OK',
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/UsersModel'
                    }
                  }
                }
              },
              '400': {
                'description': 'Bad Request'
              },
              '401': {
                'description': 'Unauthorized'
              },
              '403': {
                'description': 'Forbidden'
              },
              '406': {
                'description': 'Not Acceptable'
              }
            },
            'tags': [
              '_internal'
            ],
            'summary': 'Create a fetch-user-based-on-jwt, from _internal',
            'operationId': 'internalFetchUserBasedOnJwtPost',
            'x-passRequest': true,
            'security': [
              {
                'ApiKey': []
              }
            ]
          }
        },
        '/auth/activate': {
          'post': {
            'requestBody': {
              'required': true,
              'content': {
                'application/json': {
                  'schema': {
                    '$ref': '#/components/schemas/AuthActivatePost'
                  }
                }
              }
            },
            'responses': {
              '200': {
                'description': 'OK',
                'content': {
                  'text/plain': {
                    'schema': {
                      'type': 'string',
                      'example': 'OK'
                    }
                  }
                }
              },
              '400': {
                'description': 'Bad Request'
              },
              '401': {
                'description': 'Unauthorized'
              },
              '403': {
                'description': 'Forbidden'
              },
              '406': {
                'description': 'Not Acceptable'
              }
            },
            'tags': [
              'Auth'
            ],
            'summary': 'Create a activate, from auth',
            'operationId': 'authActivatePost',
            'x-passRequest': true
          }
        }
      }
    };
    const response: any = {
      'openapi': '3.0.0',
      'info': {
        'version': '0.0.1',
        'title': 'backend-swagger',
        'description': 'backend swagger',
        'license': {
          'name': 'Apache 2.0',
          'url': 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
      },

      'paths': {
        '/_internal/fetch-user-based-on-jwt': {
          'post': {
            'requestBody': {
              'required': true,
              'content': {
                'application/json': {
                  'schema': {
                    '$ref': '#/components/schemas/InternalFetchUserBasedOnJwtPost'
                  }
                }
              }
            },
            'responses': {
              '200': {
                'description': 'OK',
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/UsersModel'
                    }
                  }
                }
              },
              '400': {
                'description': 'Bad Request'
              },
              '401': {
                'description': 'Unauthorized'
              },
              '403': {
                'description': 'Forbidden'
              },
              '406': {
                'description': 'Not Acceptable'
              }
            },
            'tags': [
              '_internal'
            ],
            'summary': 'Create a fetch-user-based-on-jwt, from _internal',
            'operationId': 'internalFetchUserBasedOnJwtPost',
            'x-passRequest': true,
            'security': [
              {
                'ApiKey': []
              }
            ]
          }
        },
        '/auth/activate': {
          'post': {
            'tags': [
              'Auth'
            ],
            'summary': 'Create a activate, from auth',
            'operationId': 'authActivatePost',
            'requestBody': {
              'required': true,
              'content': {
                'application/json': {
                  'schema': {
                    '$ref': '#/components/schemas/AuthActivatePost'
                  }
                }
              }
            },
            'responses': {
              '200': {
                'description': 'OK',
                'content': {
                  'text/plain': {
                    'schema': {
                      'type': 'string',
                      'example': 'OK'
                    }
                  }
                }
              },
              '400': {
                'description': 'Bad Request'
              },
              '401': {
                'description': 'Unauthorized'
              },
              '403': {
                'description': 'Forbidden'
              },
              '406': {
                'description': 'Not Acceptable'
              }
            },
            'x-passRequest': true
          }
        }
      }
    };
    expect(SortAttributes.forOpenAPI(input)).toEqual(response);
  });
  it('asyncapi', () => {
    const input: any = {
      'asyncapi': '2.0.0',
      'info': {
        'title': 'ms_rabbitmq_d',
        'version': '1.0.1',
        'description': 'Async api documentation of routing keys and payloads'
      },
      'defaultContentType': 'application/json',
      'channels': {
        '/KK/EVENT/ADMIN/[any]/SUCCESS/REALM_ROLE/CREATE': {
          'publish': {
            'message': {
              'payload': {
                '$ref': '#/components/schemas/KkBaseAttributes'
              },
              'contentType': 'application/json'
            },
            'operationId': 'KK.EVENT.ADMIN.*.SUCCESS.REALM_ROLE.CREATE'
          },
          'description': ' REALM_ROLE, from SUCCESS, from [any], from ADMIN, from EVENT, from KK'
        }
      }
    };
    const response = {
      'asyncapi': '2.0.0',
      'info': {
        'title': 'ms_rabbitmq_d',
        'version': '1.0.1',
        'description': 'Async api documentation of routing keys and payloads'
      },
      'defaultContentType': 'application/json',
      'channels': {
        '/KK/EVENT/ADMIN/[any]/SUCCESS/REALM_ROLE/CREATE': {
          'description': ' REALM_ROLE, from SUCCESS, from [any], from ADMIN, from EVENT, from KK',
          'publish': {
            'message': {
              'payload': {
                '$ref': '#/components/schemas/KkBaseAttributes'
              },
              'contentType': 'application/json'
            },
            'operationId': 'KK.EVENT.ADMIN.*.SUCCESS.REALM_ROLE.CREATE'
          }
        }
      }
    };
    expect(SortAttributes.forAsyncAPI(input)).toEqual(response);
  });
});
