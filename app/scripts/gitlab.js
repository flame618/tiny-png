const {
  sso: { requestWithToken, login },
} = require('@ies/sso-kit');
const { logger } = require('@ies/eden-util');

/**
 * gitlab相关接口
 */
const url = {
  REPOSITORY_NEW: 'https://codebase.byted.org/views_api/repository/new/',
  REPOSITORY_LIST: 'https://codebase.byted.org/views_api/repository/get_repository/',
  NAMESPACE: 'https://codebase.byted.org/views_api/repository/namespace/',
  DEPARTMENT: 'https://codebase.byted.org/views_api/repository/department/',
  LOGIN_OLD: 'https://code.byted.org/users/sign_in',
  INSTALL_APP: 'https://codebase.byted.org/madeira/api/v1/apps/',
  SEARCH: 'https://codebase.byted.org/views_api/repository/get_repository/',
};

async function ensureLogin() {
  // Prepare JWT token if necessary
  const refreshToken = await requestWithToken(
    'https://codebase.byted.org/api/v1/changelogs?platform=madeira&fresh=true'
  );

  if (refreshToken.statusCode === 401) {
    await login();
    await requestWithToken('https://codebase.byted.org/cas/login?redirect_url=https%3A%2F%2Fcodebase.byted.org%2F');
    await requestWithToken(
      'https://codebase.byted.org/api/v1/changelogs?platform=madeira&fresh=true'
    );
  }
}
/**
 * 创建仓库的具体请求细节
 */
async function createRepositoryRequest({
  namespace,
  name,
  visibilityLevel = 'normal',
  departmentId = 288980000064981408,
  groupPermissions = { "55181": "developer" },
  employeePermissions = employeePermissions
}) {
  if (!(await getNamespaces()).includes(namespace)) {
    throw `Namespace: ${namespace} is not exsited`;
  }

  await ensureLogin();

  const res = await requestWithToken(url.REPOSITORY_NEW, {
    method: 'POST',
    content: JSON.stringify({
      platform: 'gitlab',
      repo_name: `${namespace}/${name}`,
      department_id: departmentId,
      employee_permissions: JSON.stringify(employeePermissions),
      group_permissions: JSON.stringify(groupPermissions),
      use_as_template: true,
      visibility_level: visibilityLevel,
    }),
    headers: {
      referer: url.REPOSITORY_NEW,
    },
  });
  return res;
}

/** */
async function createRepositoryX({
  namespace,
  name,
  visibilityLevel = 'normal',
  departmentId,
  groupPermissions,
  employeePermissions
}, {
  silent = false
} = {}
) {
  let res = await createRepositoryRequest({
    namespace,
    name,
    visibilityLevel,
    departmentId,
    groupPermissions,
    employeePermissions
  });
  let data;
  try {
    data = JSON.parse(res.data.toString());
  } catch (e) {
    !silent && logger.error(res.data.toString());
    data = {
      success: false,
      message: 'Create repository failed',
    };
  }

  const repositoryUrl = getRepositoryUrl(namespace, name);

  if (!data.success) {
    const errorMsg = data.error_message || data.message || '';
    !silent && logger.error(`Create repository failed : ${errorMsg}`);
    return {
      success: false,
      message: data.error_message || data.message || '',
    };
  } else {
    !silent && logger.success(`Create success: ${repositoryUrl}`);
  }

  return repositoryUrl;
}

async function getNamespaces() {
  await ensureLogin();

  const namespaces = await requestWithToken(url.NAMESPACE);

  if (namespaces && namespaces.data) {
    const res = JSON.parse(namespaces.data.toString());

    if (res.success) {
      return res.namespaces;
    } else {
      throw new Error(namespaces.data);
    }
  }

  throw new Error(`No data returned: ${namespaces}`);
}

/**
 * make up bytedance reponsitory url
 *
 * @param {*} namespace
 * @param {*} name
 * @returns
 */
function getRepositoryUrl(namespace, name) {
  return `git@code.byted.org:${namespace}/${name}.git`;
}

module.exports = {
  createRepositoryX
}